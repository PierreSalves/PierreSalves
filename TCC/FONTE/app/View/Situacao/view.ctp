<div class="modal-dialog" style="width:auto;margin-top:2em">
	<div class="modal-content">
		<div class="modal-header">
			<div class="modal-title">
				<div class="row">
					<div class="col-md-12">
						<legend><?php echo __('Visualizando Situação') ?></legend>
					</div>
				</div>
			</div>
		</div>
		<div class="modal-body">
			<div class="row">
				<div class="col-md-6">
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
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="modal-footer">
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
	</div>
</div>
<script>
	$(document).ready(function() {
		escolherCor('<?php echo $dados['Situacao']['sitcorprimaria']; ?>', 'sitcorprimaria');
		escolherCor('<?php echo $dados['Situacao']['sitcorsecundaria']; ?>', 'sitcorsecundaria');
		escolherCor('<?php echo $dados['Situacao']['sitcorfonte']; ?>', 'sitcorfonte');
	});
</script>
