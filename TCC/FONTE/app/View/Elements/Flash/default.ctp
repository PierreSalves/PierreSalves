<script>
	swal({
		title: "<?php echo !empty($params['title']) ? $params['title'] : 'success'; ?>",
		text: "<?php echo h($message) ?>",
		icon: "<?php echo !empty($params['icon']) ? $params['icon'] : 'success'; ?>",
		button: "OK",
	});
</script>
