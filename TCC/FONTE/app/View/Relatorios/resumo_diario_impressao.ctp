<div class="<?php echo $classLayout; ?>">
	<div class="row">
		<div class="col-md-12">
			<?php echo $this->Html->image(
				'/img/shield-dog-solid-black.png',
				array(
					'alt' => 'logo',
					'width' => '50',
					'class' => 'pull-left'
				)
			); ?>
			<h3 class="pull-left" style="margin: 0;padding: 12px 15px;">BkpTracker </h3>
			<small class="pull-right">Usuário: <?php echo $usuario['usercodigo'] ?> - <?php echo $usuario['usernome'] ?> / Data de Emissão : <?php echo date('d/m/Y, H:i:s') ?></small>
		</div>
	</div>
	<hr>
	<legend class="text-left h3">Resumo de Diário do Cliente no Período de <?php echo $periodo['inicio']; ?> até <?php echo $periodo['termino']; ?></legend>

	<table class="table table-condensed table-striped">
		<thead>
			<tr>
				<th><b>Data</b></th>
				<th class="text-center"><b>Código</b></th>
				<th><b>Cliente</b></th>
				<th><b>Cliente Abrev.</b></th>
				<th><b>Backup</b></th>
				<th class="text-center"><b>Número</b></th>
				<th><b>Situação</b></th>
				<th><b>Descrição</b></th>
			</tr>
		</thead>
		<tbody>
			<?php $linhaAnterior['his'] = '';
			$linhaAnterior['cln'] = '';
			foreach ($dadosRelatorio as $key => $linha) : ?>
				<?php if ($linha['his'] != $linhaAnterior['his'] || $linha['cln'] != $linhaAnterior['cln']) : ?>
					<tr>
						<td rowspan="<?php echo $rowSpan[$linha['cln']['clncodigo']]; ?>"><?php echo $linha['his']['hisdata'] ?></td>
						<td class="text-center" rowspan="<?php echo $rowSpan[$linha['cln']['clncodigo']]; ?>"><?php echo $linha['cln']['clncodigo'] ?></td>
						<td rowspan="<?php echo $rowSpan[$linha['cln']['clncodigo']]; ?>"><?php echo $linha['cln']['clndescricao'] ?></td>
						<td rowspan="<?php echo $rowSpan[$linha['cln']['clncodigo']]; ?>"><?php echo $linha['cln']['clndescricaoreduzido'] ?></td>
					<?php
					$linhaAnterior['his'] = $linha['his'];
					$linhaAnterior['cln'] = $linha['cln'];
				endif; ?>
					<td><?php echo $linha['bkt']['bktnomearquivo']; ?></td>
					<td><?php echo $linha['rec']['recnumero']; ?></td>
					<td><?php echo $linha['sit']['sitreduzido']; ?></td>
					<td><?php echo $linha['sit']['sitdescricao']; ?></td>
					</tr>
				<?php endforeach; ?>
		</tbody>
	</table>
</div>
