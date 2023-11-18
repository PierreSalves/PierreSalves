<?php
App::uses('AppModel', 'Model');

class Usuario extends AppModel
{
	/**
	 * Use table
	 *
	 * @var mixed False or table name
	 */
	var $useTable = 'bkp002';

	/**
	 * Primary key field
	 *
	 * @var string
	 */
	public $primaryKey = 'usercodigo';

	/**
	 * Display field
	 *
	 * @var string
	 */
	public $displayField = 'usernome';

	public $hasMany = array(
		'Cliente' => array(
			'className' => 'Cliente',
			'foreignKey' => 'clnusercodigo',
			'conditions' => array(
				'clnsituacao' => 'A'
			)
		),
		'Backups' => array(
			'className' => 'Backups',
			'foreignKey' => 'bktusercodigo',
			'conditions' => array(
				'bktsituacao' => 'A'
			)
		),
		'Situacao' => array(
			'className' => 'Situacao',
			'foreignKey' => 'situsercodigo',
			'conditions' => array(
				'sitsituacao' => 'A'
			)
		)
	);
}
