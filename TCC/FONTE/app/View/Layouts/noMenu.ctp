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
<!DOCTYPE html>
<html>

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
    echo $this->fetch('css');
    ?>

    <?php

    echo $this->Html->script(
        array(
            '/plugins/jquery-1.10.2.min',
            '/plugins/jquery-migrate-1.2.1.min',
            '/plugins/bootstrap/js/bootstrap.min',
            '/plugins/bootstrap/js/bootstrap2-typeahead.min',
            '/plugins/bootstrap-hover-dropdown/twitter-bootstrap-hover-dropdown.min',
            '/plugins/jquery.blockui.min',
            '/plugins/jquery.cookie.min',
            '/plugins/bootstrap-fileupload/bootstrap-fileupload',
            '/plugins/bootstrap-datepicker/js/bootstrap-datepicker',
            '/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker',
            '/plugins/bootstrap-daterangepicker/moment.min',
            '/plugins/bootstrap-daterangepicker/daterangepicker',
            '/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker',
            '/plugins/bootstrap-timepicker/js/bootstrap-timepicker',
            '/plugins/jquery-inputmask/jquery.inputmask.bundle.min',
            '/plugins/jquery.input-ip-address-control-1.0.min',
            '/plugins/jquery-multi-select/js/jquery.multi-select',
            '/plugins/jquery-multi-select/js/jquery.quicksearch',
            '/plugins/jquery.pwstrength.bootstrap/src/pwstrength',
            '/plugins/bootstrap-switch/static/js/bootstrap-switch.min',
            '/plugins/jquery-tags-input/jquery.tagsinput.min',
            '/plugins/moment.min',
            '/plugins/jquery.mockjax',
            '/plugins/bootstrap-editable/bootstrap-editable/js/bootstrap-editable.min',
            '/plugins/bootstrap-editable/inputs-ext/address/address',
            '/plugins/sweetalert/dist/sweetalert.min',
			'all.min',
			'apiBackups'
        )
    );
    echo $this->fetch('script');
    ?>
</head>

<body>
	<nav class="navbar navbar-fixed-top">
		<div class="row">
			<div class="col-md-12">
				<?php echo $this->Html->image(
					'/img/shield-dog-solid-white.png',
					array(
						'alt' => 'logo',
						'width' => '50',
						'class' => 'pull-left'
					)
				); ?>
				<h1 class="pull-left" style="margin: 0;padding: 5px 12px;">BkpTracker</h1>
				<h1 class="pull-right" style="margin: 0;padding: 5px 12px;">
					<div class="dropdown">
						<button class="btn btn-sm btn-primary dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" style="font-size: 15px !important;min-width: 160px ">
							<span class="glyphicon glyphicon-user"></span>&nbsp;
							<?php echo $this->Session->read('Auth.User.usernome'); ?>&nbsp;&nbsp;
							<span class="caret"></span>
						</button>
						<ul class="dropdown-menu dropdown-menu-right pull-right" aria-labelledby="dropdownMenu1">
							<li>
								<?php echo $this->Html->link(
									__('<i class="glyphicon glyphicon-log-out">&nbsp;</i>Sair'),
									array(
										'controller' => 'Usuario',
										'action' => 'logout'
									),
									array(
										'class' => '',
										'escape' => false
									)

								);
								?>
							</li>
						</ul>
					</div>
				</h1>
			</div>
		</div>
	</nav>
		<div class="container">
			<?php echo $this->Flash->render('flash') ?>
			<?php echo $this->fetch('content') ?>
		</div>
</body>

</html>
