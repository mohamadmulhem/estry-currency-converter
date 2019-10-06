<div class="form-group <?= isset($div_class) ? $div_class : '' ?>">
    <label class="control-label col-xs-12 col-sm-12 <?= $label_class ?>" for="<?= $input_id ?>">
        <?= $label_value ?>
        <?php if ($required): ?>
            <span class="required" aria-required="true"> * </span>
        <?php endif; ?>
    </label>
    <div class="<?= isset($input_container_class) ? $input_container_class : 'col-xs-12 col-sm-12' ?>">
        <input
                type="<?= isset($input_type) && $input_type ? $input_type : 'text' ?>"
                name="<?= $input_name ?>"
            <?= isset($input_min_length) && $input_min_length ? 'minlength="' . $input_min_length . '"' : '' ?>
            <?= isset($input_max_length) && $input_max_length ? 'maxlength="' . $input_max_length . '"' : '' ?>
                id="<?= $input_id ?>"
                data-required="<?= $required ?>"
                class=" form-control <?= isset($replace_class) && $replace_class ? '' : 'input-medium' ?> <?= $input_class ?>"
                placeholder="<?= $placeholder ?>"
                value="<?= $input_value ?>" <?= isset($suffix_label) && $suffix_label ? 'style="display:inline"' : '' ?>
                autocomplete="<?= isset($auto_complete) ? $auto_complete : 'on' ?>"
                aria-describedby="<?=$help_text_id?>"
            <?= $required ? 'required' : '' ?>
            <?= isset($disabled) && $disabled ? 'disabled' : '' ?>>
        <?= isset($suffix_label) && $suffix_label ? '<span>' . $suffix_label . '</span>' : '' ?>
        <small id="<?=$help_text_id?>" class="form-text text-muted">
            <?=$help_text?>
        </small>
        <?php if (isset($submit_btn) && $submit_btn): ?>
            <br>
            <button
                    type="button"
                    submit-url="<?= $submit_btn_url ?>"
                    data-loading-text="Loading..."
                    class="btn blue mt-ladda-btn ladda-button mt-progress-demo btn-circle <?= $submit_btn_class ?>"
                    data-style="slide-left">
                <span class="ladda-label"><?= $submit_btn_value ?></span>
            </button>
        <?php endif; ?>
    </div>
</div>