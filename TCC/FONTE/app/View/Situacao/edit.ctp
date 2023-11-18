<div class="modal-dialog" style="width:auto;margin-top:2em">
	<div class="modal-content">
		<div class="modal-header">
			<div class="modal-title">
				<div class="row">
					<div class="col-md-12">
						<legend><?php echo __('Editando Situação') ?></legend>
					</div>
				</div>
			</div>
		</div>
		<?php echo $this->Form->create(
			'Situacao',
			[
				'url' => [
					'controller' => 'Situacao',
					'action' => 'edit',
					$dados['Situacao']['sitcodigo'],
				],
				'type' => 'post'
			]
		) ?>
		<div class="modal-body">
			<div class="row">
				<div class="col-md-6">
					<?php echo $this->Form->hidden(
						'sitcodigo',
						array(
							'value' => $dados['Situacao']['sitcodigo'],
						)
					);  ?>
					<?php echo $this->Form->input(
						'sitreduzido',
						[
							'label' => 'Descrição',
							'type' => 'text',
							'class' => 'form-control',
							'value' => $dados['Situacao']['sitreduzido'],
							'maxlength' => '100',
							'required'
						]
					); ?>
				</div>
				<div class="col-md-6">
					<?php echo $this->Form->input(
						'sitdescricao',
						[
							'label' => 'Descrição Detalhada',
							'type' => 'text',
							'class' => 'form-control',
							'value' => $dados['Situacao']['sitdescricao'],
							'maxlength' => '300',
							'required'
						]
					); ?>
				</div>
			</div>
			<div class="row">
				<div class="col-md-3">
					<?php echo $this->Form->label('sitcorprimaria', 'Cor Primária'); ?>
					<div class="input-group">
						<?php echo $this->Form->input(
							'sitcorprimaria',
							[
								'type' => 'text',
								'class' => 'form-control input-group-addon input-sm',
								'div' => false,
								'label' => false,
								'id' => 'sitcorprimaria',
								'value' => $dados['Situacao']['sitcorprimaria'],
								'required',
								'readonly'
							]
						); ?>
						<div class="input-group-btn">
							<button type="button" class="btn btn-sm btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								<span class="caret"></span>
								<span class="sr-only">Toggle Dropdown</span>
							</button>
							<?php echo $this->Html->nestedList(
								array(
									'<a href="javascript:escolherCor(\'#ffffff\',\'sitcorprimaria\')" class="white">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#e5e5e5\',\'sitcorprimaria\')" class="cinza-claro">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#CBCBCB\',\'sitcorprimaria\')" class="cinza">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#85C1E9\',\'sitcorprimaria\')" class="azul-secondary">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#3498DB\',\'sitcorprimaria\')" class="azul-primary">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#363636\',\'sitcorprimaria\')" class="cinza-escuro">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#000000\',\'sitcorprimaria\')" class="preto">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#58D68D\',\'sitcorprimaria\')" class="verde-secondary">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#2ECC71\',\'sitcorprimaria\')" class="verde-primary">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#F7DC6F\',\'sitcorprimaria\')" class="laranja-secondary">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#F39C12\',\'sitcorprimaria\')" class="laranja-primary">&nbsp;</a>',
								),
								array(
									'class' => 'dropdown-menu dropdown-menu-right pull-right',
									'style' => 'left:auto;padding:0'
								)
							);
							?>
						</div>
					</div>
				</div>
				<div class="col-md-3">
					<?php echo $this->Form->label('sitcorsecundaria', 'Cor Secundária'); ?>
					<div class="input-group">
						<?php echo $this->Form->input(
							'sitcorsecundaria',
							[
								'type' => 'text',
								'class' => 'form-control input-group-addon input-sm',
								'div' => false,
								'label' => false,
								'id' => 'sitcorsecundaria',
								'value' => $dados['Situacao']['sitcorsecundaria'],
								'required',
								'readonly'
							]
						); ?>
						<div class="input-group-btn">
							<button type="button" class="btn btn-sm btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								<span class="caret"></span>
								<span class="sr-only">Toggle Dropdown</span>
							</button>
							<?php echo $this->Html->nestedList(
								array(
									'<a href="javascript:escolherCor(\'#ffffff\',\'sitcorsecundaria\')" class="white">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#e5e5e5\',\'sitcorsecundaria\')" class="cinza-claro">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#CBCBCB\',\'sitcorsecundaria\')" class="cinza">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#363636\',\'sitcorsecundaria\')" class="cinza-escuro">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#000000\',\'sitcorsecundaria\')" class="preto">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#85C1E9\',\'sitcorsecundaria\')" class="azul-secondary">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#3498DB\',\'sitcorsecundaria\')" class="azul-primary">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#58D68D\',\'sitcorsecundaria\')" class="verde-secondary">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#2ECC71\',\'sitcorsecundaria\')" class="verde-primary">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#F7DC6F\',\'sitcorsecundaria\')" class="laranja-secondary">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#F39C12\',\'sitcorsecundaria\')" class="laranja-primary">&nbsp;</a>',
								),
								array(
									'class' => 'dropdown-menu dropdown-menu-right pull-right',
									'style' => 'left:auto;padding:0'
								)
							);
							?>
						</div>
					</div>
				</div>
				<div class="col-md-3">
					<?php echo $this->Form->label('sitcorfonte', 'Cor da Fonte'); ?>
					<div class="input-group">
						<?php echo $this->Form->input(
							'sitcorfonte',
							[
								'type' => 'text',
								'class' => 'form-control input-group-addon input-sm',
								'div' => false,
								'label' => false,
								'id' => 'sitcorfonte',
								'value' => $dados['Situacao']['sitcorfonte'],
								'required',
								'readonly'
							]
						); ?>
						<div class="input-group-btn">
							<button type="button" class="btn btn-sm btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								<span class="caret"></span>
								<span class="sr-only">Toggle Dropdown</span>
							</button>
							<?php echo $this->Html->nestedList(
								array(
									'<a href="javascript:escolherCor(\'#ffffff\',\'sitcorfonte\')" class="white">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#e5e5e5\',\'sitcorfonte\')" class="cinza-claro">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#CBCBCB\',\'sitcorfonte\')" class="cinza">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#363636\',\'sitcorfonte\')" class="cinza-escuro">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#000000\',\'sitcorfonte\')" class="preto">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#85C1E9\',\'sitcorfonte\')" class="azul-secondary">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#3498DB\',\'sitcorfonte\')" class="azul-primary">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#58D68D\',\'sitcorfonte\')" class="verde-secondary">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#2ECC71\',\'sitcorfonte\')" class="verde-primary">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#F7DC6F\',\'sitcorfonte\')" class="laranja-secondary">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#F39C12\',\'sitcorfonte\')" class="laranja-primary">&nbsp;</a>',
								),
								array(
									'class' => 'dropdown-menu dropdown-menu-right pull-right',
									'style' => 'left:auto;padding:0'
								)
							);
							?>
						</div>
					</div>
				</div>
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
<script>
	$(document).ready(function() {
		escolherCor('<?php echo $dados['Situacao']['sitcorprimaria']; ?>', 'sitcorprimaria');
		escolherCor('<?php echo $dados['Situacao']['sitcorsecundaria']; ?>', 'sitcorsecundaria');
		escolherCor('<?php echo $dados['Situacao']['sitcorfonte']; ?>', 'sitcorfonte');
	});
</script>
