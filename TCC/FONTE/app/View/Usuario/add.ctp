<div class="modal-dialog" style="width:auto;margin-top:2em">
	<div class="modal-content">
		<div class="modal-header">
			<div class="modal-title">
				<div class="row">
					<div class="col-md-12">
						<legend><?php echo __('Adicionando Usuário') ?></legend>
					</div>
				</div>
			</div>
		</div>
		<?php echo $this->Form->create(
			'Usuario',
			[
				'url' => [
					'controller' => 'Usuario',
					'action' => 'add',
				],
				'type' => 'post'
			]
		) ?>
		<div class="modal-body">
			<div class="row">
				<div class="col-md-6">
					<?php echo $this->Form->input(
						'usernome',
						[
							'label' => 'Nome',
							'type' => 'text',
							'class' => 'form-control',
							'required'
						]
					); ?>
				</div>
				<div class="col-md-6">
					<?php echo $this->Form->input(
						'useremail',
						[
							'label' => 'Email',
							'type' => 'email',
							'class' => 'form-control',
							'required'
						]
					); ?>
				</div>
			</div>

			<div class="row">
				<div class="col-md-6">
					<?php echo $this->Form->input(
						'userlogin',
						[
							'label' => 'Login',
							'type' => 'text',
							'class' => 'form-control',
							'required'
						]
					); ?>
				</div>
				<div class="col-md-6">
					<?php echo $this->Form->input(
						'userpassword',
						[
							'label' => 'Senha',
							'type' => 'password',
							'class' => 'form-control',
							'required'
						]
					); ?>
				</div>
				<!-- <div class="col-md-4">
                    <?php echo $this->Form->input(
						'usersituacao',
						[
							'label' => 'Situação',
							'type' => 'select',
							'options' => ['A' => 'Ativo', 'I' => 'Inativo'],
							'empty' => false,
							'class' => 'form-control',
							'required'
						]
					); ?>
                 </div> -->
			</div>
		</div>
		<div class="modal-footer">
			<?php echo $this->Form->button(
				__('<i class="glyphicon glyphicon-floppy-disk"></i> Salvar'),
				[
					'type' => 'submit',
					'class' => 'btn btn-primary',
				]
			) ?>

			<?php echo $this->Html->link(
				__('<i class="glyphicon glyphicon-remove"></i> Cancelar'),
				[
					'action' => 'index'
				],
				[
					'class' => 'btn btn-danger',
					'escape' => false
				]
			) ?>
		</div>
		<?php echo $this->Form->end() ?>
	</div>
</div>
