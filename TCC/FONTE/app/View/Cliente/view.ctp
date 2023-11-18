<div class="modal-dialog" style="width:auto;margin-top:2em">
	<div class="modal-content">
		<div class="modal-header">
			<div class="modal-title">
				<div class="row">
					<div class="col-md-12">
						<legend><?php echo __('Visualizando Cliente') ?></legend>
					</div>
				</div>
			</div>
		</div>
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
							'disabled' => 'disabled'
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
							'disabled' => 'disabled'
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
							'disabled' => 'disabled'
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
							'value' => $cliente['Cliente']['clnchavelogin'],
							'disabled' => 'disabled'
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
							'value' => $cliente['Cliente']['clnchavepwd'],
							'disabled' => 'disabled'
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
							</div>
						</div>
						<div class="panel-body">
							<div class="list-group" id="listBackups">
								<?php foreach ($cliente['Backups'] as $key => $backup) : ?>
									<div class="list-group-item">
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
														'disabled'
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
														'disabled' => true
													)
												); ?>
											</div>
										</div>
									</div>
								<?php endforeach; ?>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="modal-footer">
			<?php echo $this->Html->link(
				__('<i class="glyphicon glyphicon-remove"></i> Voltar'),
				[
					'action' => 'index'
				],
				[
					'class' => 'btn btn-default',
					'escape' => false
				]
			) ?>
		</div>
	</div>
</div>
<script>
	$(document).ready(function() {
		escolherCor('<?php echo $cliente['Cliente']['clncorprimaria']; ?>', 'clncorprimaria');
		escolherCor('<?php echo $cliente['Cliente']['clncorsecundaria']; ?>', 'clncorsecundaria');
		escolherCor('<?php echo $cliente['Cliente']['clncorfonte']; ?>', 'clncorfonte');
	});
</script>
