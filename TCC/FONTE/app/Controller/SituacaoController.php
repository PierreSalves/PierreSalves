<?php

class SituacaoController extends AppController
{

	var $uses = array(
		'Backups',
		'Situacao',
		'Historico',
		'Usuario',
	);

	public $components = array(
		'Session',
		'Paginator'
	);

	function index()
	{
		$this->layout = 'noMenu';

		$this->Paginator->settings = array(
			'limit' => 5,
			'conditions' => array(
				'situsercodigo' => $this->Session->read('Auth.User.usercodigo'),
				'sitsituacao' => 'A'
			)
		);

		$this->set('listaSituacao', $this->Paginator->paginate('Situacao'));
	}

	function add()
	{
		$this->layout = 'ajax';

		if ($this->request->is('post')) {

			$novaSituacao = $this->request->data['Situacao'];
			$novaSituacao['sitsituacao'] = 'A';
			$novaSituacao['sitdatasituacao'] = date('Y-m-d H:i:s');
			$novaSituacao['situsercodigo'] = $this->Session->read('Auth.User.usercodigo');
			$novaSituacao['sitdatacriacao'] = date('Y-m-d H:i:s');

			if ($this->Situacao->save($novaSituacao)) {

				$this->Session->setFlash('Situação Salva com Sucesso!', 'default', array('icon' => 'success', 'title' => 'Sucesso'));
				$this->redirect(array('action' => 'index'));
			} else {
				$this->Session->setFlash('Houve um Erro ao tentar Salvar a Situação!', 'default', array('icon' => 'warning', 'title' => 'Atenção'));
				$this->redirect(array('action' => 'index'));
			}
		}
	}

	function view($sitcodigo)
	{
		$this->layout = 'ajax';

		$dadosSit = $this->Situacao->find(
			'first',
			array(
				'conditions' =>	array(
					'sitcodigo' => $sitcodigo
				)
			)
		);
		$this->set('dados', $dadosSit);
	}

	function edit($sitcodigo)
	{
		$this->layout = 'ajax';

		$dadosSit = $this->Situacao->find(
			'first',
			array(
				'conditions' =>	array(
					'sitcodigo' => $sitcodigo
				)
			)
		);
		$this->set('dados', $dadosSit);

		if ($this->request->is('post')) {

			$editSituacao = $this->request->data['Situacao'];

			if ($this->Situacao->save($editSituacao)) {

				$this->Session->setFlash('Situação Salva com Sucesso!', 'default', array('icon' => 'success', 'title' => 'Sucesso'));
				$this->redirect(array('action' => 'index'));
			} else {
				$this->Session->setFlash('Houve um Erro ao tentar Salvar a Situação!', 'default', array('icon' => 'warning', 'title' => 'Atenção'));
				$this->redirect(array('action' => 'index'));
			}
		}
	}

	function delete($sitcodigo)
	{
		$this->layout = null;
		$this->autoRender = false;

		$inativarSituacao['sitcodigo'] = $sitcodigo;
		$inativarSituacao['sitsituacao'] = 'I';
		$inativarSituacao['sitdatasituacao'] = date('Y-m-d H:i:s');

		if ($this->Situacao->save($inativarSituacao)) {
			$this->Session->setFlash('Situação Excluida com Sucesso!', 'default', array('icon' => 'success', 'title' => 'Sucesso'));
		};

		$this->redirect(array('controller' => 'Situacao', 'action' => 'index'));
	}
}
