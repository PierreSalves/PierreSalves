<?php

/**
 * CakePHP(tm) : Rapid Development Framework (https://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (https://cakefoundation.org)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Cake Software Foundation, Inc. (https://cakefoundation.org)
 * @link          https://cakephp.org CakePHP(tm) Project
 * @package       app.View.Layouts
 * @since         CakePHP(tm) v 0.10.0.1076
 * @license       https://opensource.org/licenses/mit-license.php MIT License
 */
$cakeDescription = __d('cake_dev', 'BkpTracker');
$cakeVersion = __d('cake_dev', 'CakePHP %s', Configure::version())
?>

<head>
	<?php echo $this->Html->charset(); ?>
	<title>
		<?php echo $cakeDescription ?>:
		<?php echo $this->fetch('title'); ?>
	</title>

	<?php
	echo $this->Html->meta('icon');
	echo $this->Html->css(
		array(
			'/plugins/font-awesome/css/font-awesome.min',
			'/plugins/bootstrap/css/bootstrap.min',
			'/plugins/bootstrap-fileupload/bootstrap-fileupload',
			'/plugins/bootstrap-datepicker/css/datepicker',
			'/plugins/bootstrap-timepicker/compiled/timepicker',
			'/plugins/bootstrap-colorpicker/css/colorpicker',
			'/plugins/bootstrap-daterangepicker/daterangepicker-bs3',
			'/plugins/bootstrap-datetimepicker/css/datetimepicker',
			'/plugins/bootstrap-switch/static/stylesheets/bootstrap-switch-metro',
			'/plugins/bootstrap-editable/bootstrap-editable/css/bootstrap-editable',
			'all.min',
			'custom',
		)
	);

	echo $this->fetch('meta');
	echo $this->fetch('css'); ?>

	<style>
		body {
			background-color: #f0f0f0;
			display: flex;
			flex-direction: column;
			align-items: center;
		}

		.page-portrait {

			background-color: #fff;
			margin: 5%;
			padding: 40px 30px;
			border: 1px solid #e5e5e5;
			border-radius: 8px;

			width: 210mm;
			min-height: 297mm;
		}

		.page-landscape {

			background-color: #fff;
			margin: 5%;
			padding: 40px 30px;
			border: 1px solid #e5e5e5;
			border-radius: 8px;

			width: 297mm;
			min-height: 210mm;
		}

		@media print {
			body {
				background-color: #fff;
				color: #000;
				text-shadow: none;
				filter: none;
				-ms-filter: none;
				display: block;
			}

			.page-portrait {

				background-color: #fff;
				margin: 0;
				padding: 0;
				border: 0px;
				border-radius: 0px;
			}

			.page-landscape {

				background-color: #fff;
				margin: 0;
				padding: 0;
				border: 0px;
				border-radius: 0px;
			}
		}
	</style>
</head>

<body class="content">
	<?php echo $this->fetch('content'); ?>
</body>
