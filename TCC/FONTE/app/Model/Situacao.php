<?php
App::uses('AppModel', 'Model');

class Situacao extends AppModel {
    /**
     * Use table
     *
     * @var mixed False or table name
     */
    var $useTable = 'bkp003';

    /**
     * Primary key field
     *
     * @var string
     */
    public $primaryKey = 'sitcodigo';

    /**
     * Display field
     *
     * @var string
     */
    public $displayField = 'sitreduzido';

}
