<?php
App::uses('AppShell', 'Console/Command');
App::uses('Shell', 'Console');
App::uses('Folder', 'Utility');
App::uses('File', 'Utility');
App::uses('AppModel', 'Model');
App::uses('Backups', 'Model');
App::uses('Cliente', 'Model');
App::uses('Historico', 'Model');
App::uses('RecorrenciaBackup', 'Model');
App::uses('Situacao', 'Model');
App::uses('Usuario', 'Model');

class ApiBkpTask extends Shell
{

	public function execute()
	{
		$backupModel = new Backups();
		$clienteModel = new Cliente();
		$historicoModel = new Historico();
		$recorrenciaBackupModel = new RecorrenciaBackup();
		$situacaoModel = new Situacao();
		$usuarioModel = new Usuario();

		$usuarios = $usuarioModel->find(
			'all',
			array(
				'conditions' => array(
					'usersituacao' => 'A'
				)
			)
		);

		if (!empty($usuarios)) {

			foreach ($usuarios as $key => $usuario) {

				$situacaoSucesso = $situacaoModel->find(
					'first',
					array(
						'conditions' => array(
							'situsercodigo' => $usuario['Usuario']['usercodigo'],
							'sitsituacao' => 'A',
						),
						'order' => array(
							'sitordem' => 'ASC'
						),
					)
				);
				$situacaoFalha = $situacaoModel->find(
					'first',
					array(
						'conditions' => array(
							'situsercodigo' => $usuario['Usuario']['usercodigo'],
							'sitsituacao' => 'A',
						),
						'order' => array(
							'sitordem' => 'DESC'
						),
					)
				);

				$clientes = $clienteModel->find(
					'all',
					array(
						'conditions' => array(
							'Cliente.clnusercodigo' => $usuario['Usuario']['usercodigo'],
							'Cliente.clnsituacao' => 'A'
						)
					)
				);

				if (!empty($usuario['Cliente'])) {

					foreach ($clientes as $key => $cliente) {

						if ($key <= count($usuario['Cliente'])) {

							$findHistExistente = '';

							$dir = new Folder($cliente['Cliente']['clnbkpcaminho']);

							foreach ($cliente['Backups'] as $key2 => $backup) {

								foreach ($backup['Recorrencia'] as $key3 => $recorrencia) {

									if ($key3 < 1) {

										$findHistExistente = $recorrencia['reccodigo'];
									} else {

										$findHistExistente .= ',' . $recorrencia['reccodigo'];
									}
								}

								$arrHistExistente = $historicoModel->find(
									'all',
									array(
										'fields' => array(
											'Historico.*'
										),
										'conditions' => array(
											'hisdata' => date('Y-m-d'),
											'hisreccodigo IN (' . $findHistExistente . ')'
										)
									)
								);

								if (!empty($arrHistExistente)) {
									foreach ($arrHistExistente as $keyHist => $historico) {

										$numeroRecorrencia = $this->getRecorrencia($historico['Historico']['hisnomecompleto']);
										$arrHistBackups[$numeroRecorrencia]['hiscodigo'] = $historico['Historico']['hiscodigo'];
									}
								}

								foreach ($backup['Recorrencia'] as $key4 => $recFalha) {

									$attSituacaoBackup[$recFalha['recnumero']]['reccodigo'] = $recFalha['reccodigo'];
									$attSituacaoBackup[$recFalha['recnumero']]['recsitcodigo'] = $situacaoFalha['Situacao']['sitcodigo'];

									if (empty($arrHistBackups[$recFalha['recnumero']])) {

										$arrHistBackups[$recFalha['recnumero']]['hisdata'] = date('Y-m-d');
										$arrHistBackups[$recFalha['recnumero']]['hisdatacriacao'] = date('Y-m-d H:i:s');
										$arrHistBackups[$recFalha['recnumero']]['hisnomecompleto'] = $backup['bktnomearquivo'] . '_' . date('Ymd') . '_' . $recFalha['recnumero'];
										$arrHistBackups[$recFalha['recnumero']]['hissitcodigo'] = $situacaoFalha['Situacao']['sitcodigo'];
										$arrHistBackups[$recFalha['recnumero']]['hisreccodigo'] = $recFalha['reccodigo'];
										$arrHistBackups[$recFalha['recnumero']]['hisbktcodigo'] = $backup['bktcodigo'];
									} else {

										$arrHistBackups[$recFalha['recnumero']]['hissitcodigo'] = $situacaoFalha['Situacao']['sitcodigo'];
									}
								}

								if (empty($cliente['Cliente']['clnchavelogin'])) {

									$arquivos = $dir->find($backup['bktnomearquivo'] . '_' . date('Ymd') . '.*_\d');
								} else {

									$diretorio = $dir->read(
										$cliente['Cliente']['clnbkpcaminho'],
										[
											'username' => $cliente['Cliente']['clnchavelogin'],
											'password' => $cliente['Cliente']['clnchavepwd']
										]
									);
									$arquivos = $diretorio[1];
								}

								if (!empty($arquivos)) {

									foreach ($arquivos as $key5 => $bkp) {

										$numeroRecorrencia = $this->getRecorrencia($bkp);

										$arrHistBackups[$numeroRecorrencia]['hisnomecompleto'] = $bkp;
										$arrHistBackups[$numeroRecorrencia]['hissitcodigo'] = $situacaoSucesso['Situacao']['sitcodigo'];

										foreach ($backup['Recorrencia'] as $key6 => $rec) {
											if ($numeroRecorrencia == $rec['recnumero']) {

												$attSituacaoBackup[$numeroRecorrencia]['reccodigo'] = $rec['reccodigo'];
												$attSituacaoBackup[$numeroRecorrencia]['recsitcodigo'] = $situacaoSucesso['Situacao']['sitcodigo'];
											}
										}
									}
								}

								$historicoModel->saveAll($arrHistBackups);
								$recorrenciaBackupModel->saveAll($attSituacaoBackup);
								unset($attSituacaoBackup);
								unset($arrHistBackups);
							}
						}
					}
				}

				unset($situacaoSucesso);
				unset($situacaoFalha);
				unset($clientes);
			}
		}
	}

	private function getRecorrencia($string)
	{
		$dot_position = strpos($string, ".");
		return substr($string, $dot_position - 1, 1);
	}
}
