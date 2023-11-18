<div class="row" style="height: 20vh;">
    <div class="col-md-3 col-xs-1">
    </div>
    <div class="col-md-6 col-xs-10">
        <?php echo $this->Flash->render('flash') ?>
    </div>
    <div class="col-md-3 col-xs-1">
    </div>
</div>
<div class="row">
    <div class="col-md-4 col-xs-1">
        &nbsp;&nbsp;&nbsp;
    </div>
    <div class="col-md-4 col-xs- 10">
        <?php echo $this->Form->create(
            'User',
            [
                'url' => [
                    'controller' => 'Usuario',
                    'action' => 'login',
                ],
                'name' => 'Login',
                'type' => 'post',
                'class' => 'form-horizontal panel azul-primary',
            ]
        ) ?>
        <div class="panel-heading text-center azul-primary">
            <div class="panel-title">
                <div style="width: 100%;">
                    <?php echo $this->Html->image(
                        '/img/shield-dog-solid-white.png',
                        array(
                            'alt' => 'logo',
                            'width' => '50'
                        )
                    ); ?>
                    <h1 class="text-white null-margin">Bkp Tracker</h1>
                </div>
            </div>
        </div>

        <div class="panel-body azul-secondary">
            <div class="row">
                <div class="col-md-12">
                    <?php echo $this->Form->control(
                        'userlogin',
                        [
                            'name' => 'userlogin',
                            'label' => false,
                            'type' => 'text',
                            'class' => 'form-control',
                            'placeholder' => 'Usuário',
                            'required'
                        ]
                    );
                    ?>
                </div>
                <div class="col-md-12">
                    <br>
                    <?php echo $this->Form->control(
                        'userpassword',
                        [
                            'name' => 'userpassword',
                            'label' => false,
                            'type' => 'password',
                            'class' => 'form-control',
                            'placeholder' => 'Senha',
                            'required'
                        ]
                    );
                    ?>
                </div>
                <div class="col-md-12 text-right">
                    <?php echo $this->Form->button(
                        '<span class="glyphicon glyphicon-log-in"></span> Login',
                        [
                            'type' => 'submit',
                            'class' => 'btn btn-primary',
                            'style' => 'margin-top:20px'
                        ]
                    );
                    ?>
                    <?php echo $this->Form->end() ?>
                </div>
            </div>
        </div>
        <div class="col-md-4 col-xs-1">
            &nbsp;&nbsp;&nbsp;
        </div>
    </div>
