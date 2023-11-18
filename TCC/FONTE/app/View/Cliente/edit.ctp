<div class="modal-dialog" style="width:auto;margin-top:2em">
	<div class="modal-content">
		<div class="modal-header">
			<div class="modal-title">
				<div class="row">
					<div class="col-md-12">
						<legend><?php echo __('Editando Cliente') ?></legend>
					</div>
				</div>
			</div>
		</div>
		<?php echo $this->Form->create(
			'Cliente',
			[
				'url' => [
					'controller' => 'Cliente',
					'action' => 'edit',
					$cliente['Cliente']['clncodigo']
				],
				'type' => 'post'
			]
		) ?>
		<div class="modal-body">
			<div class="row">
				<div class="col-md-12">
					<?php echo $this->Form->input(
						'clndescricao',
						array(
							'label' => 'Descrição',
							'type' => 'textarea',
							'rows' => '1',
							'class' => 'form-control',
							'maxlength' => '500',
							'value' => $cliente['Cliente']['clndescricao'],
							'required' => true,
						)
					); ?>
				</div>
			</div>

			<div class="row">
				<div class="col-md-6">
					<?php echo $this->Form->input(
						'clndescricaoreduzido',
						array(
							'label' => 'Descrição Reduzida',
							'type' => 'textarea',
							'rows' => '1',
							'class' => 'form-control',
							'maxlength' => '100',
							'value' => $cliente['Cliente']['clndescricaoreduzido'],
							'required' => true,
						)
					); ?>
				</div>
				<div class="col-md-6">
					<?php echo $this->Form->input(
						'clnbkpcaminho',
						array(
							'label' => 'Caminho Diretório',
							'type' => 'text',
							'class' => 'form-control',
							'maxlength' => '300',
							'value' => $cliente['Cliente']['clnbkpcaminho'],
							'required' => true,
						)
					); ?>
				</div>
			</div>

			<div class="row">
				<div class="col-md-6">
					<?php echo $this->Form->input(
						'clnchavelogin',
						array(
							'label' => 'Chave de Acesso Login',
							'type' => 'text',
							'class' => 'form-control',
							'maxlength' => '100',
							'value' => $cliente['Cliente']['clnchavelogin']
						)
					); ?>
				</div>
				<div class="col-md-6">
					<?php echo $this->Form->input(
						'clnchavepwd',
						array(
							'label' => 'Chave de Acesso Senha',
							'type' => 'text',
							'class' => 'form-control',
							'maxlength' => '100',
							'value' => $cliente['Cliente']['clnchavepwd']
						)
					); ?>
				</div>
			</div>

			<div class="row">
				<div class="col-md-4">
					<?php echo $this->Form->label('clncorprimaria', 'Cor Primária'); ?>
					<div class="input-group">
						<?php echo $this->Form->input(
							'clncorprimaria',
							[
								'type' => 'text',
								'class' => 'form-control input-group-addon input-sm',
								'div' => false,
								'label' => false,
								'id' => 'clncorprimaria',
								'value' => $cliente['Cliente']['clncorprimaria'],
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
									'<a href="javascript:escolherCor(\'#ffffff\',\'clncorprimaria\')" class="white">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#e5e5e5\',\'clncorprimaria\')" class="cinza-claro">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#CBCBCB\',\'clncorprimaria\')" class="cinza">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#363636\',\'clncorprimaria\')" class="cinza-escuro">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#000000\',\'clncorprimaria\')" class="preto">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#85C1E9\',\'clncorprimaria\')" class="azul-secondary">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#3498DB\',\'clncorprimaria\')" class="azul-primary">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#58D68D\',\'clncorprimaria\')" class="verde-secondary">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#2ECC71\',\'clncorprimaria\')" class="verde-primary">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#F7DC6F\',\'clncorprimaria\')" class="laranja-secondary">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#F39C12\',\'clncorprimaria\')" class="laranja-primary">&nbsp;</a>',
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
				<div class="col-md-4">
					<?php echo $this->Form->label('clncorsecundaria', 'Cor Secundária'); ?>
					<div class="input-group">
						<?php echo $this->Form->input(
							'clncorsecundaria',
							[
								'type' => 'text',
								'class' => 'form-control input-group-addon input-sm',
								'div' => false,
								'label' => false,
								'id' => 'clncorsecundaria',
								'value' => $cliente['Cliente']['clncorsecundaria'],
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
									'<a href="javascript:escolherCor(\'#ffffff\',\'clncorsecundaria\')" class="white">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#e5e5e5\',\'clncorsecundaria\')" class="cinza-claro">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#CBCBCB\',\'clncorsecundaria\')" class="cinza">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#363636\',\'clncorsecundaria\')" class="cinza-escuro">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#000000\',\'clncorsecundaria\')" class="preto">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#85C1E9\',\'clncorsecundaria\')" class="azul-secondary">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#3498DB\',\'clncorsecundaria\')" class="azul-primary">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#58D68D\',\'clncorsecundaria\')" class="verde-secondary">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#2ECC71\',\'clncorsecundaria\')" class="verde-primary">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#F7DC6F\',\'clncorsecundaria\')" class="laranja-secondary">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#F39C12\',\'clncorsecundaria\')" class="laranja-primary">&nbsp;</a>',
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
				<div class="col-md-4">
					<?php echo $this->Form->label('clncorfonte', 'Cor da Fonte'); ?>
					<div class="input-group">
						<?php echo $this->Form->input(
							'clncorfonte',
							[
								'type' => 'text',
								'class' => 'form-control input-group-addon input-sm',
								'div' => false,
								'label' => false,
								'id' => 'clncorfonte',
								'value' => $cliente['Cliente']['clncorfonte'],
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
									'<a href="javascript:escolherCor(\'#ffffff\',\'clncorfonte\')" class="white">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#e5e5e5\',\'clncorfonte\')" class="cinza-claro">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#CBCBCB\',\'clncorfonte\')" class="cinza">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#363636\',\'clncorfonte\')" class="cinza-escuro">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#000000\',\'clncorfonte\')" class="preto">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#85C1E9\',\'clncorfonte\')" class="azul-secondary">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#3498DB\',\'clncorfonte\')" class="azul-primary">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#58D68D\',\'clncorfonte\')" class="verde-secondary">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#2ECC71\',\'clncorfonte\')" class="verde-primary">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#F7DC6F\',\'clncorfonte\')" class="laranja-secondary">&nbsp;</a>',
									'<a href="javascript:escolherCor(\'#F39C12\',\'clncorfonte\')" class="laranja-primary">&nbsp;</a>',
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
		<div class="modal-body">
			<div class="row">
				<div class="col-md-12">
					<div class="panel panel-default">
						<div class="panel-heading">
							<div class="panel-title">
								<h4>Backups do Cliente</h4>
								<?php echo $this->Form->button(
									'<i class="glyphicon glyphicon-plus"></i>',
									array(
										'type' => 'button',
										'class' => 'btn btn-primary btn-sm',
										'title' => 'Adicionar Backup',
										'onclick' => 'addElements(\'' . $this->Html->url(array('controller' => 'Backups', 'action' => 'addElement')) . '\',\'#listBackups\')'
									)
								); ?>
							</div>
						</div>
						<div class="panel-body">
							<div class="list-group" id="listBackups">
								<?php foreach ($cliente['Backups'] as $key => $backup) : ?>
									<div class="list-group-item" id="item_<?php echo $key; ?>">
										<div class="row">
											<div class="col-md-9">
												<?php echo $this->Form->input(
													"Cliente.Backups.$key.bktnomearquivo",
													array(
														'label' => 'Nome do Arquivo',
														'type' => 'text',
														'class' => 'form-control input-sm',
														'maxlength' => '100',
														'value' => $backup['bktnomearquivo'],
														'required'
													)
												); ?>
											</div>
											<div class="col-md-2" title="Quantas vezes o backup é realizado no dia">
												<?php echo $this->Form->input(
													"Cliente.Backups.$key.bktrecorrencia",
													array(
														'label' => 'Recorrência',
														'type' => 'number',
														'class' => 'form-control input-sm',
														'min' => 1,
														'step' => 1,
														'value' => $backup['bktrecorrencia'],
														'required' => true
													)
												); ?>
											</div>
											<div class="col-md-1 text-right">
												<?php echo $this->Form->button(
													'<i class="glyphicon glyphicon-minus"></i>',
													array(
														'type' => 'button',
														'class' => 'btn btn-sm btn-danger',
														'title' => 'Remover Backup',
														'style' => 'margin-top:25px;',
														'onclick' => 'removeElements(\'#item_' . $key . '\')'
													)
												); ?>
											</div>
										</div>
									</div>
									<script>
										window.sessionStorage['i'] = parseInt(<?php echo $key; ?>);
									</script>
								<?php endforeach; ?>
							</div>
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
		<?php echo $this->Form->end(); ?>
	</div>
</div>
<script>
	$(document).ready(function() {
		escolherCor('<?php echo $cliente['Cliente']['clncorprimaria']; ?>', 'clncorprimaria');
		escolherCor('<?php echo $cliente['Cliente']['clncorsecundaria']; ?>', 'clncorsecundaria');
		escolherCor('<?php echo $cliente['Cliente']['clncorfonte']; ?>', 'clncorfonte');
	});
</script>
