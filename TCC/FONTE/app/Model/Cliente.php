<?php
App::uses('AppModel', 'Model');

class Cliente extends AppModel
{
	/**
	 * Use table
	 *
	 * @var mixed False or table name
	 */
	var $useTable = 'bkp001';

	/**
	 * Primary key field
	 *
	 * @var string
	 */
	public $primaryKey = 'clncodigo';

	/**
	 * Display field
	 *
	 * @var string
	 */
	public $displayField = 'clndescricao';

	public $recursive = 2;

	public $hasMany = array(
		'Backups' => array(
			'className' => 'Backups',
			'foreignKey' => 'bktclncodigo',
			'conditions' => array(
				'bktsituacao' => 'A'
			),
			'fields' => array(),
			'order' => array()
		)
	);

	// public $belongsTo = array(
	// 	'Usuario' => array(
	// 		'className' => 'Usuario',
	// 		'foreignKey' => 'clnusercodigo'
	// 	)
	// );
}
