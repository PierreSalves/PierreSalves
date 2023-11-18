<?php echo $this->Flash->render('flash') ?>
<div class="row">
	<?php foreach ($bkp001 as $cliente) : ?>
		<div class="col-md-3">
			<div class="panel" style="background-color: <?php echo $cliente['Cliente']['clncorprimaria']; ?>;">
				<div class="panel-heading panel-title" style="background-color: <?php echo $cliente['Cliente']['clncorprimaria']; ?>;color: <?php echo $cliente['Cliente']['clncorfonte']; ?>;">
					<?php echo $cliente['Cliente']['clndescricaoreduzido']; ?>
				</div>
				<div class="panel-body card-body" style="background-color: <?php echo $cliente['Cliente']['clncorsecundaria']; ?>;">
					<?php echo $cliente['Cliente']['clndescricao']; ?>
					<?php foreach ($cliente['Backups'] as $key => $backup) : ?>
						<?php foreach ($backup['Recorrencia'] as $key2 => $rec) : ?>
							<div class="list-group-item" style="
								background-color: <?php echo $sitBackup[$rec['recsitcodigo']]['Situacao']['sitcorsecundaria'] ?>;
								color: <?php echo $sitBackup[$rec['recsitcodigo']]['Situacao']['sitcorfonte'] ?>;
								border-top: 1px solid <?php echo $sitBackup[$rec['recsitcodigo']]['Situacao']['sitcorsecundaria'] ?>;
								border-right: 1px solid <?php echo $sitBackup[$rec['recsitcodigo']]['Situacao']['sitcorsecundaria'] ?>;
								border-bottom: 1px solid <?php echo $sitBackup[$rec['recsitcodigo']]['Situacao']['sitcorsecundaria'] ?>;
								border-left: 4px solid <?php echo $sitBackup[$rec['recsitcodigo']]['Situacao']['sitcorprimaria'] ?>;
								">
								<?php echo $backup['bktnomearquivo'] . '_' . $rec['recnumero'] ?>
							</div>
						<?php endforeach; ?>
					<?php endforeach; ?>
				</div>
			</div>
		</div>
	<?php endforeach; ?>
</div>

<script>
	setTimeout(function() {
		window.location.href = '<?php echo $this->Html->url(array('controller' => 'Backups', 'action' => 'attBackups',)); ?>';
	}, 600000);
</script>
