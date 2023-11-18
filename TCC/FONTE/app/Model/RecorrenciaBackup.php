<?php
App::uses('AppModel', 'Model');

class RecorrenciaBackup extends AppModel
{
	/**
	 * Use table
	 *
	 * @var mixed False or table name
	 */
	var $useTable = 'bkp005';

	/**
	 * Primary key field
	 *
	 * @var string
	 */
	public $primaryKey = 'reccodigo';

	/**
	 * Display field
	 *
	 * @var string
	 */
	public $displayField = 'recbktcodigo';

	// public $belongsTo = array(
	// 	'Cliente' => array(
	// 		'className' => 'Cliente', //className – define o model que será associado.
	// 		'foreignKey' => 'bktclncodigo', //foreignKey – define o nome da chave estrangeira encontrada no model atual. Isto é especialmente útil se você precisa definir múltiplos relacionamentos belongsTo.
	// 		'conditions' => array(), //conditions – define as condições utilizadas em uma consulta SQL.
	// 		'fields' => array(), //fields - lista de campos a serem recuperados quando os dados do model associado são coletados. Retorna todos os campos por padrão.
	// 		'order' => array() //order – define a ordem de retorno das linhas associadas.
	// 	),
	// 	'Situacao' => array(
	// 		'className' => 'Situacao',
	// 		'foreignKey' => 'bktsitcodigo',
	// 	),
	// 	'Usuario' => array(
	// 		'className' => 'Usuario',
	// 		'foreignKey' => 'bktusercodigo'
	// 	)
	// );
}
