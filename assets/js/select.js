//select - 전체 닫기
function closeAllSelect() {
    $('.select_box').removeClass('open').each(function(){
        const $options = $(this).find('.options');
        $options.attr('aria-hidden', 'true').stop(true, true).slideUp(150);
        $(this).find('.val').attr('aria-expanded', 'false');
    });
}

//select - selected 값 설정 및 placeholder 설정
$('.select_box').each(function(){
    const $val = $(this).find('.val');
    const $selected = $(this).find('[role="option"][aria-selected="true"]');
    if ($selected.length) {
        $val.text($selected.text()).removeClass('c_gray8 c_primary');
    } 
    else if ($(this).data('placeholder')) {
        if($(this).closest('.select_box').hasClass('line_blue')){
            $val.text($(this).data('placeholder')).addClass('c_primary');
        } else {
            $val.text($(this).data('placeholder')).addClass('c_gray8');
        }
    }
    $(this).find('.options').attr('aria-hidden', 'true');
});

//select - 열기
function openSelect($box, moveFocus = false) {
    if ($box.hasClass('dsb')) return;
    closeAllSelect();
    $box.addClass('open');
    const $btn = $box.find('.val');
    $btn.attr('aria-expanded', 'true');

    const $options = $box.find('.options');
    $options.attr('aria-hidden', 'false').stop(true, true).slideDown(150);

    if (moveFocus) {
        const $selected = $box.find('[role="option"][aria-selected="true"]');
        const $target = $selected.length ? $selected : $box.find('[role="option"]').first();
        $target.focus();
    }
}

//select - toggle
$(document).on('click', '.select_box .val', function(){
    const $selectBox = $(this).closest('.select_box');
    if ($selectBox.hasClass('dsb')) return;
    $selectBox.hasClass('open') ? closeAllSelect() : openSelect($selectBox);
});

//select - 옵션 선택 함수 (마우스)
function selectOption($option) {
    const $selectBox = $option.closest('.select_box');
    const $selectVal = $selectBox.find('.val');
    $selectBox.find('[role="option"]').attr('aria-selected', 'false').attr('tabindex', -1);
    $option.attr('aria-selected', 'true').attr('tabindex', 0);
    $selectVal.text($option.text()).removeClass('c_gray8 c_primary t_rg');
    $selectBox.trigger('option:selected', [$option.text(), $option]);
    closeAllSelect();
    $selectVal.focus();
}

//select - 옵션 선택 (마우스)
$(document).on('click', '.select_box .options > li[role="option"]', function(e){
    e.stopPropagation();
    selectOption($(this));
});

//select - 버튼 키보드 제어
$(document).on('keydown', '.select_box .val', function(e){
    const $selectBox = $(this).closest('.select_box');
    switch (e.key) {
        case 'Tab':
            closeAllSelect();
        break;
        case 'ArrowDown':
        case 'Enter':
        case ' ':
            e.preventDefault();
            openSelect($selectBox, true);
        break;
        case 'Escape':
            closeAllSelect();
        break;
    }
});

//select - 옵션 키보드 제어
$(document).on('keydown', '.select_box .options > li[role="option"]', function(e){
    const $options = $(this).closest('.select_box').find('[role="option"]');
    let index = $options.index(this);
    switch (e.key) {
        case 'Tab':
            closeAllSelect();
        break;
        case 'ArrowDown':
            e.preventDefault();
            index = (index + 1) % $options.length;
            $options.eq(index).focus();
        break;
        case 'ArrowUp':
            e.preventDefault();
            index = (index - 1 + $options.length) % $options.length;
            $options.eq(index).focus();
        break;
        case 'Enter':
        case ' ':
            e.preventDefault();
            selectOption($(this));
        break;
        case 'Escape':
            e.preventDefault();
            closeAllSelect();
            $(this).closest('.select_box').find('.val').focus();
        break;
    }
});