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
	<legend class="text-left h3">Resumo de Clientes Agrupadas no Período de <?php echo $periodo['inicio']; ?> até <?php echo $periodo['termino']; ?> por Situação</legend>

	<table class="table table-condensed table-striped">
		<thead>
			<tr>
				<th class="text-center"><b>Código</b></th>
				<th><b>Situação</b></th>
				<th><b>Descrição</b></th>
				<th class="text-center"><b>Número</b></th>
				<th class="text-center"><b>Quantidade</b></th>
			</tr>
		</thead>
		<tbody>
			<?php foreach ($dadosRelatorio as $key => $linha) : ?>
				<tr>
					<td class="text-center"><?php echo $linha['sit']['sitcodigo'] ?></td>
					<td><?php echo $linha['sit']['sitreduzido'] ?></td>
					<td><?php echo $linha['sit']['sitdescricao'] ?></td>
					<td class="text-center"><?php echo $linha['sit']['sitordem'] ?></td>
					<td class="text-center"><?php echo $linha[0]['count'] ?></td>
				</tr>
			<?php endforeach; ?>
		</tbody>
	</table>
</div>
