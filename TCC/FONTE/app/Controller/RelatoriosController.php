<?php

class RelatoriosController extends AppController
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
	}

	function resumoCliente()
	{
		$this->layout = 'noMenu';

		$arrClientes = $this->Cliente->find(
			'list',
			[
				'conditions' => [
					'clnusercodigo' => $this->Session->read('Auth.User.usercodigo'),
					'clnsituacao' => 'A'
				]
			]
		);

		$optClientes = [0 => 'Todos'];
		foreach ($arrClientes as $clncodigo => $clndescricao) {
			$optClientes[$clncodigo] = $clndescricao;
		}

		$this->set('optClientes', $optClientes);

		$arrSituacao = $this->Situacao->find(
			'list',
			[
				'conditions' => [
					'situsercodigo' => $this->Session->read('Auth.User.usercodigo'),
					'sitsituacao' => 'A'
				]
			]
		);

		$optSituacao = [0 => 'Todas'];
		foreach ($arrSituacao as $sitcodigo => $sitreduzido) {
			$optSituacao[$sitcodigo] = $sitreduzido;
		}

		$this->set('optSituacao', $optSituacao);
	}

	function resumoClienteImpressao()
	{
		$this->layout = 'impressao';

		$dataInicio = DateTimeImmutable::createFromFormat('d/m/Y', $this->request->data['Filtros']['dataInicio']);
		$dataFim = DateTimeImmutable::createFromFormat('d/m/Y', $this->request->data['Filtros']['dataFim']);
		$cliente = $this->request->data['Filtros']['cliente'];
		$situacao = $this->request->data['Filtros']['situacao'];
		$ordem = $this->request->data['Filtros']['ordem'];

		$layout = $this->request->data['Filtros']['layout'] == 1 ? 'page-portrait' : 'page-landscape';

		$formatedDataInicio = strtotime($dataInicio->format('Y-m-d'));
		$formatedDataFim = strtotime($dataFim->format('Y-m-d'));

		if ($formatedDataFim < $formatedDataInicio) {

			$this->Session->setFlash('Atenção, a data término não pode ser menor que a data de início', 'default', array('class' => 'alert alert-warning'));
			$this->redirect(array('action' => 'resumoCliente'));
		}

		$dadosRelatorio = $this->Historico->resumoCliente($formatedDataInicio, $formatedDataFim, $cliente, $situacao, $ordem, $this->Session->read('Auth.User.usercodigo'));

		if (empty($dadosRelatorio)) {

			$this->Session->setFlash('Atenção, não foi possível completar a solicitação, tente novamente mais tarde', 'default', array('class' => 'alert alert-warning'));
			$this->redirect(array('action' => 'resumoCliente'));
		}


		$periodo['inicio'] =  $this->request->data['Filtros']['dataInicio'];
		$periodo['termino'] =  $this->request->data['Filtros']['dataFim'];

		$usuario['usercodigo'] = $this->Session->read('Auth.User.usercodigo');
		$usuario['usernome'] = $this->Session->read('Auth.User.usernome');

		$this->set('usuario', $usuario);
		$this->set('periodo', $periodo);
		$this->set('classLayout', $layout);
		$this->set('dadosRelatorio', $dadosRelatorio);
	}

	function resumoSituacao()
	{
		$this->layout = 'noMenu';

		$arrClientes = $this->Cliente->find(
			'list',
			[
				'conditions' => [
					'clnusercodigo' => $this->Session->read('Auth.User.usercodigo'),
					'clnsituacao' => 'A'
				]
			]
		);

		$optClientes = [0 => 'Todos'];
		foreach ($arrClientes as $clncodigo => $clndescricao) {
			$optClientes[$clncodigo] = $clndescricao;
		}

		$this->set('optClientes', $optClientes);

		$arrSituacao = $this->Situacao->find(
			'list',
			[
				'conditions' => [
					'situsercodigo' => $this->Session->read('Auth.User.usercodigo'),
					'sitsituacao' => 'A'
				]
			]
		);

		$optSituacao = [0 => 'Todas'];
		foreach ($arrSituacao as $sitcodigo => $sitreduzido) {
			$optSituacao[$sitcodigo] = $sitreduzido;
		}

		$this->set('optSituacao', $optSituacao);
	}

	function resumoSituacaoImpressao()
	{
		$this->layout = 'impressao';

		$dataInicio = DateTimeImmutable::createFromFormat('d/m/Y', $this->request->data['Filtros']['dataInicio']);
		$dataFim = DateTimeImmutable::createFromFormat('d/m/Y', $this->request->data['Filtros']['dataFim']);
		$cliente = $this->request->data['Filtros']['cliente'];
		$situacao = $this->request->data['Filtros']['situacao'];
		$ordem = $this->request->data['Filtros']['ordem'];

		$layout = $this->request->data['Filtros']['layout'] == 1 ? 'page-portrait' : 'page-landscape';

		$formatedDataInicio = strtotime($dataInicio->format('Y-m-d'));
		$formatedDataFim = strtotime($dataFim->format('Y-m-d'));

		if ($formatedDataFim < $formatedDataInicio) {

			$this->Session->setFlash('Atenção, a data término não pode ser menor que a data de início', 'default', array('class' => 'alert alert-warning'));
			$this->redirect(array('action' => 'resumoSituacao'));
		}

		$dadosRelatorio = $this->Historico->resumoSituacao($formatedDataInicio, $formatedDataFim, $cliente, $situacao, $ordem, $this->Session->read('Auth.User.usercodigo'));

		if (empty($dadosRelatorio)) {

			$this->Session->setFlash('Atenção, não foi possível completar a solicitação, tente novamente mais tarde', 'default', array('class' => 'alert alert-warning'));
			$this->redirect(array('action' => 'resumoSituacao'));
		}


		$periodo['inicio'] =  $this->request->data['Filtros']['dataInicio'];
		$periodo['termino'] =  $this->request->data['Filtros']['dataFim'];

		$usuario['usercodigo'] = $this->Session->read('Auth.User.usercodigo');
		$usuario['usernome'] = $this->Session->read('Auth.User.usernome');

		$this->set('usuario', $usuario);
		$this->set('periodo', $periodo);
		$this->set('classLayout', $layout);
		$this->set('dadosRelatorio', $dadosRelatorio);
	}

	function resumoDiario()
	{
		$this->layout = 'noMenu';

		$arrClientes = $this->Cliente->find(
			'list',
			[
				'conditions' => [
					'clnusercodigo' => $this->Session->read('Auth.User.usercodigo'),
					'clnsituacao' => 'A'
				]
			]
		);

		$optClientes = [0 => 'Todos'];
		foreach ($arrClientes as $clncodigo => $clndescricao) {
			$optClientes[$clncodigo] = $clndescricao;
		}

		$this->set('optClientes', $optClientes);
	}

	function resumoDiarioImpressao()
	{
		$this->layout = 'impressao';

		$dataInicio = DateTimeImmutable::createFromFormat('d/m/Y', $this->request->data['Filtros']['dataInicio']);
		$dataFim = DateTimeImmutable::createFromFormat('d/m/Y', $this->request->data['Filtros']['dataFim']);
		$cliente = $this->request->data['Filtros']['cliente'];
		$ordem = $this->request->data['Filtros']['ordem'];

		$layout = $this->request->data['Filtros']['layout'] == 1 ? 'page-portrait' : 'page-landscape';

		$formatedDataInicio = strtotime($dataInicio->format('Y-m-d'));
		$formatedDataFim = strtotime($dataFim->format('Y-m-d'));

		if ($formatedDataFim < $formatedDataInicio) {

			$this->Session->setFlash('Atenção, a data término não pode ser menor que a data de início', 'default', array('class' => 'alert alert-warning'));
			$this->redirect(array('action' => 'resumoDiario'));
		}

		$dadosRelatorio = $this->Historico->resumoDiario($formatedDataInicio, $formatedDataFim, $cliente, $ordem, $this->Session->read('Auth.User.usercodigo'));

		if (empty($dadosRelatorio)) {

			$this->Session->setFlash('Atenção, não foi possível completar a solicitação, tente novamente mais tarde', 'default', array('class' => 'alert alert-warning'));
			$this->redirect(array('action' => 'resumoDiario'));
		}

		$linhaAnterior['his'] = '';
		$linhaAnterior['cln'] = '';
		$rowspan = array();
		foreach ($dadosRelatorio as $key => $linha) {

			if ($linha['his'] != $linhaAnterior['his'] || $linha['cln'] != $linhaAnterior['cln']) {

				$rowspan[$linha['cln']['clncodigo']] = 1;
				$linhaAnterior['his'] = $linha['his'];
				$linhaAnterior['cln'] = $linha['cln'];
			} else {

				$rowspan[$linha['cln']['clncodigo']]++;
			}
		}

		$periodo['inicio'] =  $this->request->data['Filtros']['dataInicio'];
		$periodo['termino'] =  $this->request->data['Filtros']['dataFim'];

		$usuario['usercodigo'] = $this->Session->read('Auth.User.usercodigo');
		$usuario['usernome'] = $this->Session->read('Auth.User.usernome');

		$this->set('usuario', $usuario);
		$this->set('periodo', $periodo);
		$this->set('classLayout', $layout);
		$this->set('dadosRelatorio', $dadosRelatorio);
		$this->set('rowSpan', $rowspan);
	}
}
