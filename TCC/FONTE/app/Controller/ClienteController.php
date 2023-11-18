<?php

class ClienteController extends AppController
{

	var $uses = array(
		'Backups',
		'Situacao',
		'Historico',
		'Cliente',
		'Usuario',
		'RecorrenciaBackup'
	);

	public $components = array('Paginator');

	function index()
	{
		$this->layout = 'noMenu';

		$this->Paginator->settings = array(
			'limit' => 5,
			'conditions' => array(
				'clnsituacao' => 'A',
				'clnusercodigo' => $this->Session->read('Auth.User.usercodigo')
			)
		);

		$this->set('listaClientes', $this->Paginator->paginate('Cliente'));
	}

	function add()
	{
		$this->layout = 'ajax';

		if ($this->request->is('post')) {

			$situacaoFalha = $this->Situacao->find(
				'first',
				array(
					'conditions' => array(
						'sitsituacao' => 'A'
					),
					'order' => array(
						'sitordem' => 'DESC'
					),
				)
			);

			$novoCliente = $this->request->data['Cliente'];
			$novoCliente['clnsituacao'] = 'A';
			$novoCliente['clndatasituacao'] = date('Y-m-d H:i:s');
			$novoCliente['clnusercodigo'] = $this->Session->read('Auth.User.usercodigo');;
			$novoCliente['clndatacriacao'] = date('Y-m-d H:i:s');

			if ($this->Cliente->save($novoCliente)) {

				foreach ($this->request->data['Cliente']['Backups'] as $key => $backup) {

					$novoBackup[$key] = $backup;
					$novoBackup[$key]['bktclncodigo'] = $this->Cliente->id;
					$novoBackup[$key]['bktsituacao'] = 'A';
					$novoBackup[$key]['bktdatasituacao'] = date('Y-m-d H:i:s');
					$novoBackup[$key]['bktusercodigo'] = $this->Session->read('Auth.User.usercodigo');
					$novoBackup[$key]['bktdatacriacao'] = date('Y-m-d H:i:s');

					$this->Backups->save($novoBackup[$key]);

					for ($i = 1; $i <= $backup['bktrecorrencia']; $i++) {

						$insertRecorrencia[$i]['recbktcodigo'] = $this->Backups->id;
						$insertRecorrencia[$i]['recnumero']	= $i;
						$insertRecorrencia[$i]['recsitcodigo'] = $situacaoFalha['Situacao']['sitcodigo'];
						$insertRecorrencia[$i]['recsituacao'] = 'A';
						$insertRecorrencia[$i]['recdatasituacao'] = date('Y-m-d H:i:s');
						$insertRecorrencia[$i]['recdatacriacao'] = date('Y-m-d H:i:s');
					}
				}

				if ($this->RecorrenciaBackup->saveAll($insertRecorrencia)) {

					$this->Session->setFlash('Cliente Salvo com Sucesso!', 'default', array('icon' => 'success', 'title' => 'Sucesso'));
					$this->redirect(array('action' => 'index'));
				} else {

					$this->Session->setFlash('Houve um Erro ao tentar Salvar o Cliente!', 'default', array('icon' => 'warning', 'title' => 'Erro'));
					$this->redirect(array('action' => 'index'));
				}
			}
		}
	}

	function edit($clncodigo)
	{
		$this->layout = 'ajax';

		$cliente = $this->Cliente->find(
			'first',
			array(
				'conditions' => array(
					'clncodigo' => $clncodigo
				)
			)
		);
		$this->set('cliente', $cliente);

		if ($this->request->is('post')) {

			$situacaoFalha = $this->Situacao->find(
				'first',
				array(
					'conditions' => array(
						'sitsituacao' => 'A'
					),
					'order' => array(
						'sitordem' => 'DESC'
					),
				)
			);

			$editCliente = $this->request->data['Cliente'];
			$editCliente['clncodigo'] = $clncodigo;

			if ($this->Cliente->save($editCliente)) {

				foreach ($this->request->data['Cliente']['Backups'] as $key => $backup) {

					if (
						isset($cliente['Backups'][$key]) &&
						$cliente['Backups'][$key]['bktnomearquivo'] == $backup['bktnomearquivo'] &&
						$cliente['Backups'][$key]['bktrecorrencia'] == $backup['bktrecorrencia']
					) {
						// Não faz nada
					} else if (isset($cliente['Backups'][$key])) {

						$editbackup[$key] = $cliente['Backups'][$key];
						$editbackup[$key]['bktnomearquivo'] = $backup['bktnomearquivo'];
						$editbackup[$key]['bktrecorrencia'] = $backup['bktrecorrencia'];

						if ($backup['bktrecorrencia'] != $cliente['Backups'][$key]['bktrecorrencia']) {

							foreach ($cliente['Backups'][$key]['Recorrencia'] as $key2 => $recorrencia1) {

								$arrInativaRecorrencia[$key2]['reccodigo'] = $recorrencia1['reccodigo'];
								$arrInativaRecorrencia[$key2]['recsituacao'] = 'I';
								$arrInativaRecorrencia[$key2]['recdatasituacao'] = date('Y-m-d H:i:s');
							}

							$this->RecorrenciaBackup->saveAll($arrInativaRecorrencia);

							for ($i = 1; $i <= $backup['bktrecorrencia']; $i++) {

								$arrInsertRecorrencia[$i]['recbktcodigo'] = $cliente['Backups'][$key]['bktcodigo'];
								$arrInsertRecorrencia[$i]['recnumero'] = $i;
								$arrInsertRecorrencia[$i]['recsitcodigo'] = $situacaoFalha['Situacao']['sitcodigo'];
								$arrInsertRecorrencia[$i]['recsituacao'] = 'A';
								$arrInsertRecorrencia[$i]['recdatasituacao'] = date('Y-m-d H:i:s');
								$arrInsertRecorrencia[$i]['recdatacriacao'] = date('Y-m-d H:i:s');
							}

							$this->RecorrenciaBackup->saveAll($arrInsertRecorrencia);
						}
					} else if (!isset($cliente['Backups'][$key])) {

						$insertbackup = $backup;
						$insertbackup['bktclncodigo'] = $this->Cliente->id;
						$insertbackup['bktsituacao'] = 'A';
						$insertbackup['bktdatasituacao'] = date('Y-m-d H:i:s');
						$insertbackup['bktusercodigo'] = $this->Session->read('Auth.User.usercodigo');;
						$insertbackup['bktdatacriacao'] = date('Y-m-d H:i:s');

						$this->Backups->create();
						$this->Backups->save($insertbackup);

						for ($i = 1; $i <= $backup['bktrecorrencia']; $i++) {

							$arrInsertRecorrencia[$i]['recbktcodigo'] = $this->Backups->id;
							$arrInsertRecorrencia[$i]['recnumero'] = $i;
							$arrInsertRecorrencia[$i]['recsituacao'] = 'A';
							$arrInsertRecorrencia[$i]['recdatasituacao'] = date('Y-m-d H:i:s');
							$arrInsertRecorrencia[$i]['recdatacriacao'] = date('Y-m-d H:i:s');
						}

						$this->RecorrenciaBackup->saveAll($arrInsertRecorrencia);
					}
				}

				foreach ($cliente['Backups'] as $key => $backupAtivo) {
					if (!isset($this->request->data['Cliente']['Backups'][$key])) {

						// verifica os backups que foram excluidos
						$editbackup[$key] = $backupAtivo;
						$editbackup[$key]['bktsituacao'] = 'I';
						$editbackup[$key]['bktdatasituacao'] = date('Y-m-d H:i:s');

						foreach ($cliente['Backups'][$key]['Recorrencia'] as $key2 => $recorrencia1) {

							$arrInativaRecorrencia[$key2]['reccodigo'] = $recorrencia1['reccodigo'];
							$arrInativaRecorrencia[$key2]['recsituacao'] = 'I';
							$arrInativaRecorrencia[$key2]['recdatasituacao'] = date('Y-m-d H:i:s');
						}

						$this->RecorrenciaBackup->saveAll($arrInativaRecorrencia);
					}
				}

				if (!empty($editbackup)) {
					$this->Backups->saveAll($editbackup);

					$this->Session->setFlash('Cliente Salvo com Sucesso!', 'default', array('icon' => 'success', 'title' => 'Sucesso'));
				}
			}

			$this->redirect(array('action' => 'index'));
		}
	}

	function view($clncodigo)
	{
		$this->layout = 'ajax';

		$cliente = $this->Cliente->find(
			'first',
			array(
				'conditions' => array(
					'clncodigo' => $clncodigo
				)
			)
		);

		$this->set('cliente', $cliente);
	}

	function delete($clncodigo)
	{
		$this->layout = null;
		$this->autoRender = false;

		$inativarCliente['clncodigo'] = $clncodigo;
		$inativarCliente['clnsituacao'] = 'I';
		$inativarCliente['clndatasituacao'] = date('Y-m-d H:i:s');

		$cliente = $this->Cliente->find(
			'first',
			array(
				'conditions' => array(
					'clncodigo' => $clncodigo
				)
			)
		);

		if ($this->Cliente->save($inativarCliente)) {

			foreach ($cliente['Backups'] as $key => $backup) {

				$inativarBackup[$key]['bktcodigo'] = $backup['bktcodigo'];
				$inativarBackup[$key]['bktsituacao'] = 'I';
				$inativarBackup[$key]['bktdatasituacao'] = date('Y-m-d H:i:s');
			}

			if ($this->Backups->saveAll($inativarBackup)) {

				$this->Session->setFlash('Cliente Excluido com Sucesso!', 'default', array('icon' => 'success', 'title' => 'Sucesso'));
				$this->redirect(array('action' => 'index'));
			}
		}
	}
}
