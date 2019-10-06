<form
        id="InputForm"
        method="post"
        class="form-horizontal">

    <div class="container-fluid settings-container">
        <div class="row">
            <h5>Estry Currency Converter</h5>
        </div>
        <div class="row">
            <div class="form-body">
                <div class="card-group">
                    <div class="card">
                        <div class="card-body">
                            <?php if (isset($response_message)): ?>
                            <div class="alert alert-success" role="alert">
                                <?= isset($response_message) ? $response_message : '' ?>
                            </div>
<?php endif; ?>