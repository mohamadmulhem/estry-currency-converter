<div class="form-group">
    <label class="control-label <?= $label_class?$label_class:'col-xs-12 col-sm-6'?>">
        <?= $label_value ?>
        <?php if ($required): ?>
            <span class="required"> * </span>
        <?php endif; ?>
    </label>
    <div class=" <?=isset($input_container_class)?$input_container_class:'col-xs-12 col-sm-12'?>">
        <select class="form-control <?= $input_class ?> "
            <?=isset($multiple) ? 'multiple="multiple"': ''?>
                name="<?= $input_name ?>" id="<?= $input_id ?>" <?=$required?'required="true"':''?>
                <?=isset($disabled) && $disabled?'disabled="true"':''?>>
            <option value="">Select...</option>
            <?php if($data):?>
            <?php if (!is_string($data)): ?>                
                <?php if (isset($normalarr))://normal array?>
                    <?php foreach ($data as $key => $value): ?>
                        <option value="<?= $key ?>" <?= $input_value == ''.$key || (is_array($input_value) && in_array($key, $input_value)) ? "selected='selected'" : '' ?>><?= $value ?></option>
                    <?php endforeach; ?>
                <?php endif; ?>
                <?php if (!isset($normalarr))://objects array?>
                    <?php foreach ($data as $item): ?>
                        <option 
                            value="<?= $item->id ?><?= isset($item->id2)?"-".$item->id2:""?>" <?= $input_value == $item->id ? "selected='selected'" : '' ?>><?= ($item->code?$item->code. '-':'') . $item->name ?></option>
                    <?php endforeach; ?>
                <?php endif; ?>
            <?php endif; ?>
            <?php if (is_string($data))://values seperated by a comma in a string ?>
                <?php $data = explode(',', $data); ?>
                <?php foreach ($data as $item): ?>
                    <option value="<?=$item?>" <?= $input_value == $item ? "selected='selected'" : '' ?>><?= $item ?></option>
                <?php endforeach; ?>
            <?php endif; ?>
            <?php endif;?>
        </select>
    </div>
</div>
