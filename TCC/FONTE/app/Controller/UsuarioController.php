<?php

class UsuarioController extends AppController
{

	var $uses = array('Auth', 'Usuario', 'Situacao');

	public $components = array(
		'Session',
		'Paginator'
	);

	function login()
	{
		$this->layout = 'login';

		if ($this->request->is('post')) {

			$requestUser = $this->Usuario->find(
				'first',
				array(
					'conditions' => array(
						'userlogin' => $this->request->data['userlogin'],
						'userpassword' => $this->request->data['userpassword'],
						'usersituacao' => 'A'
					)
				)
			);

			if (!empty($requestUser)) {

				$this->Auth->login($requestUser['Usuario']);
				return $this->redirect($this->Auth->redirect());
			} else {
				$this->Session->setFlash('Usuário ou Senha Incorretos', 'default', array('icon' => 'warning', 'title' => 'Atenção'));
			}
		}
	}

	public function logout()
	{
		$this->Session->destroy();

		return $this->redirect($this->Auth->logout());
	}


	function index()
	{
		if ($this->Session->read('Auth.User.useradm') != 'S') {
			$this->Session->setFlash('Você não tem permissão para realizar esta ação!', 'default', array('icon' => 'error', 'title' => 'Atenção'));
			$this->redirect(array('controller' => 'Backups', 'action' => 'index'));
		};

		$this->layout = 'noMenu';

		$this->Paginator->settings = array(
			'limit' => 5,
			'conditions' => array(
				'usersituacao' => 'A'
			)
		);

		$this->set('listaUsuarios', $this->Paginator->paginate('Usuario'));
	}

	function add()
	{
		if ($this->Session->read('Auth.User.useradm') != 'S') {
			$this->Session->setFlash('Você não tem permissão para realizar esta ação!', 'default', array('icon' => 'error', 'title' => 'Atenção'));
			$this->redirect(array('controller' => 'Backups', 'action' => 'index'));
		};

		$this->layout = 'ajax';

		if ($this->request->is('post')) {

			$this->request->data['Usuario']['usersituacao'] =  'A';
			$this->request->data['Usuario']['userdatasituacao'] = date('Y-m-d H:i:s');
			$this->request->data['Usuario']['userdatacriacao'] = date('Y-m-d H:i:s');

			$existente = $this->Usuario->find(
				'first',
				array(
					'conditions' => array(
						'userlogin' => $this->request->data['Usuario']['userlogin'],
						'usersituacao' => 'A'
					)
				)
			);

			if (empty($existente)) {

				$this->Usuario->save($this->request->data['Usuario']);

				$insertSituacao[1]['sitordem'] = 1;
				$insertSituacao[1]['sitreduzido'] = 'OK';
				$insertSituacao[1]['sitdescricao'] = 'Recebido';
				$insertSituacao[1]['sitsituacao'] = 'A';
				$insertSituacao[1]['sitdatasituacao'] = date('Y-m-d H:i:s');
				$insertSituacao[1]['situsercodigo'] = $this->Usuario->id;
				$insertSituacao[1]['sitdatacriacao'] = date('Y-m-d H:i:s');

				$insertSituacao[2]['sitordem'] = 2;
				$insertSituacao[2]['sitreduzido'] = 'Pendente';
				$insertSituacao[2]['sitdescricao'] = 'Não Recebido';
				$insertSituacao[2]['sitsituacao'] = 'A';
				$insertSituacao[2]['sitdatasituacao'] = date('Y-m-d H:i:s');
				$insertSituacao[2]['situsercodigo'] = $this->Usuario->id;
				$insertSituacao[2]['sitdatacriacao'] = date('Y-m-d H:i:s');

				$this->Situacao->create();
				$this->Situacao->saveAll($insertSituacao);

				$this->Session->setFlash('Usuário Salvo com Sucesso!', 'default', array('icon' => 'success', 'title' => 'Sucesso'));
				$this->redirect(array('action' => 'index'));
			};

			$this->Session->setFlash('Login de usuário existente', 'default', array('icon' => 'warning', 'title' => 'Atenção'));
			$this->redirect(array('action' => 'index'));
		}
	}

	function edit($usercodigo)
	{
		if ($this->Session->read('Auth.User.useradm') != 'S') {
			$this->Session->setFlash('Você não tem permissão para realizar esta ação!', 'default', array('icon' => 'error', 'title' => 'Atenção'));
			$this->redirect(array('controller' => 'Backups', 'action' => 'index'));
		};

		$this->layout = 'ajax';

		$this->set('usuario', $this->Usuario->find('first', array('conditions' => array('usercodigo' => $usercodigo))));

		if ($this->request->is('post')) {

			// $this->request->data['Usuario']['userpassword'] = Security::hash($this->request->data['Usuario']['userpassword'], 'blowfish');
			$this->request->data['Usuario']['userdatasituacao'] = date('Y-m-d H:i:s');
			$this->request->data['Usuario']['userdatacriacao'] = date('Y-m-d H:i:s');

			$existente = $this->Usuario->find(
				'first',
				array(
					'conditions' => array(
						'userlogin' => $this->request->data['Usuario']['userlogin'],
						'usersituacao' => 'A'
					)
				)
			);

			if (empty($existente)) {
				$this->Usuario->save($this->request->data['Usuario']);

				$this->Session->setFlash('Usuário Salvo com Sucesso!', 'default', array('icon' => 'success', 'title' => 'Sucesso'));
				$this->redirect(array('action' => 'index'));
			};
		}
	}

	function view($usercodigo)
	{
		if ($this->Session->read('Auth.User.useradm') != 'S') {
			$this->Session->setFlash('Você não tem permissão para realizar esta ação!', 'default', array('icon' => 'error', 'title' => 'Atenção'));
			$this->redirect(array('controller' => 'Backups', 'action' => 'index'));
		};

		$this->layout = 'ajax';

		$this->set('usuario', $this->Usuario->find('first', array('conditions' => array('usercodigo' => $usercodigo))));
	}

	function delete($usercodigo)
	{
		if ($this->Session->read('Auth.User.useradm') != 'S') {
			$this->Session->setFlash('Você não tem permissão para realizar esta ação!', 'default', array('icon' => 'error', 'title' => 'Atenção'));
			$this->redirect(array('controller' => 'Backups', 'action' => 'index'));
		};

		$this->layout = null;
		$this->autoRender = false;

		$inativarUsuario['usercodigo'] = $usercodigo;
		$inativarUsuario['usersituacao'] = 'I';
		$this->request->data['Usuario']['userdatasituacao'] = date('Y-m-d H:i:s');

		if ($this->Usuario->save($inativarUsuario)) {
			$this->Session->setFlash('Usuário Excluido com Sucesso!', 'default', array('icon' => 'success', 'title' => 'Sucesso'));
			$this->redirect(array('action' => 'index'));
		};
	}
}
