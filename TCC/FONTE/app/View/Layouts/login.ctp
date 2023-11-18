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
 * @since         0.10.0
 * @license       https://opensource.org/licenses/mit-license.php MIT License
 * @var \App\View\AppView $this
 */
?>
<!DOCTYPE html>
<html>

<head>
	<?= $this->Html->charset() ?>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<?=
	$this->Html->meta('icon');
	$this->fetch('meta') ?>
	<title>
		BkpTracker
	</title>

	<?= $this->Html->script('jquery.min.js') ?>
	<?= $this->Html->script('bootstrap.min.js') ?>
	<?= $this->Html->script(
		'/plugins/sweetalert/dist/sweetalert.min'
	) ?>
	<?= $this->fetch('script') ?>

	<?= $this->Html->css('bootstrap.min.css', ['data-no-css-map' => true]) ?>
	<?= $this->Html->css('custom.css') ?>
	<?= $this->fetch('css') ?>
</head>

<body>
	<div class="container clearfix">
		<?= $this->Flash->render() ?>
		<?= $this->fetch('content') ?>
	</div>
</body>

</html>
