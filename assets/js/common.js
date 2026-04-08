$(function(){
    //include - 로컬 환경에서만 사용
    $('header').load('../../include/header.html');
    $('aside').load('../../include/aside.html', function(){
        $.getJSON('../../assets/js/menu.json', function(menuData){
            menuInit(menuData);
        });
    });
    $('.table_content').each(function() {
        if ($(this).hasClass('no_table') || $(this).hasClass('no_sc')) return;
        if ($(this).hasClass('type2')) {
            $(this).load('../../include/table2.html');
        } else {
            $(this).load('../../include/table.html');
        }
    });
    $('.page_area').load('../../include/page.html');

    //js 호출 - 로컬 환경에서만 사용
    $.getScript('../../assets/js/confirm.js');
    $.getScript('../../assets/js/select.js');

    //menu - on 함수
    function menuInit(menuData){
        const currentPath = window.location.pathname.split("/").pop();
        let currentMenu = null;
        let onPageUrl = currentPath;

        //menu 및 현재 page 찾기
        for(const menu of menuData.menu){
            const page = menu.pages.find(p => p.url === currentPath);
            if(page){
                currentMenu = menu;
                if(page.parent) onPageUrl = page.parent;
                break;
            }
        }
        if(!currentMenu) return;

        console.log(currentPath, currentMenu)

        //menu gnb - on
        $('.gnb li a.item').removeClass('on');
        currentMenu.pages.forEach(p => $('.gnb li a.item[href$="' + p.url + '"]').addClass('on'));

        //menuSub - 생성
        if(currentMenu.icon !== "ico_dashboard"){
            const menuSubHtml = `<nav class="menuSub" aria-label="서브 메뉴">
                                    <h2>${currentMenu.title}</h2>
                                    <ul class="lnb"></ul>
                                </nav>`;
            $('aside .menu').after(menuSubHtml);

            //menuSub lnb - 생성 (parent 없는 페이지만)
            const lnbHtml = currentMenu.pages
                .filter(p => !p.parent)
                .map(p => `<li><a href="../${p.url}" class="item ${p.url === onPageUrl ? 'on' : ''}">${p.name}</a></li>`)
                .join('');
            $('aside .menuSub .lnb').html(lnbHtml);
        }
    }

    //menu - hover (펼치기)
    $(document).on('mouseenter', '.menu', function() {
        if (!$(this).hasClass('open')) {
            $(this).css({
                width: '240px',
                padding: '8px',
                borderRight: '1px solid #E6E8F1'
            });
            $(this).find('.item > span').removeClass('vis_hidden');
        }
    });

    //menu - blur (접기)
    $(document).on('mouseleave', '.menu', function() {
        if (!$(this).hasClass('open')) {
            $(this).css({
                width: '64px',
                padding: '8px',
                borderRight: 'none'
            });
            $(this).find('.item > span').addClass('vis_hidden');
        }
    });

    //menu - open toggle
    $(document).on('click', '.menu .menu_toggle', function() {
        const $menu = $(this).closest('.menu');
        const $aside = $(this).closest('aside');
        $menu.toggleClass('open')
        if ($menu.hasClass('open')) {
            $aside.css('padding-left', '240px');
            $menu.css({
                width: '240px',
                padding: '8px',
                boxShadow: 'none'
            });
            $menu.find('.item > span').removeClass('vis_hidden');
        } else {
            $aside.css('padding-left', '64px');
            $menu.css({
                width: '64px',
                padding: '8px'
            });
            $menu.find('.item > span').addClass('vis_hidden');
        }
    });

    //header user - 열기 & 닫기
    $(document).on('click', 'header .ico_user', function(){
        $(this).toggleClass('open');
        if($(this).hasClass('open')) {
            $('.header_user').fadeIn(200);
        } else{
            $('.header_user').fadeOut(200);
        }
    });

    //input - 숫자만 입력 가능
    $(document).on('input', '.numOnly > input[type="text"]', function() {
        $(this).val($(this).val().replace(/[^0-9]/g, ''));
    });

    //input - 비밀번호 숨기기 & 보기
    $(document).on('click', '.form_item .eye', function() {
        $(this).toggleClass('on');
        if(!$(this).hasClass('on')) {
            $(this).closest('.form_item').find('input').attr('type', 'password');
        } else {
            $(this).closest('.form_item').find('input').attr('type', 'text');
        }
    });

    //table - all check 
    $(document).on('change', '.table_item input[type="checkbox"]', function () {
        const tableChk = $(this).closest('.table_item');
        if ($(this).closest('label').hasClass('chk_all')) {
            tableChk.find('tbody td input[type="checkbox"]').prop('checked', $(this).prop('checked'));
        } else {
            tableChk.find('.chk_all > input[type="checkbox"]').prop(
                'checked',
                tableChk.find('tbody td input[type="checkbox"]').length ===
                tableChk.find('tbody td input[type="checkbox"]:checked').length
            );
        }
    });

    //table - href 이동(추후 삭제)
    $(document).on('click', '.table_content tbody tr', function () {
        const t_href = $(this).closest('.table_content').data('href');
        if (t_href) {
            loadingShow();
            setTimeout(function() {
                window.location.href = t_href + ".html";
            }, 2500);
        } else {return;}
    });

    //table - rowspan 그룹 hover 효과
    $(document).on('mouseenter mouseleave', '.table_content.type2 tr', function(e) {
        const $firstTr = $(this).find('td[rowspan]').length ? $(this) : $(this).prevAll('tr:has(td[rowspan])').first();
        const rowNum = +$firstTr.find('td[rowspan]').first().attr('rowspan');
        const $rowGroup = $firstTr.add($firstTr.nextAll().slice(0, rowNum - 1));
        $rowGroup.find('td').css('background', e.type === 'mouseenter' ? 'var(--color-blue2)' : '');
    });

    //datepicker - 초기 설정
    const today = new Date();

    //datepicker - 한글 로케일 적용
    $(".datepicker").datepicker({
        dateFormat: "yy.mm.dd",
        showAnim: "slideDown",
        changeMonth: true,
        changeYear: true,
        showButtonPanel: true,
        showMonthAfterYear: true,
        monthNames: ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],
        monthNamesShort: ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],
        dayNamesMin: ["일","월","화","수","목","금","토"],
        yearRange: (today.getFullYear() - 5) + ":" + today.getFullYear()
    });

    //datepicker - tab 클릭 시 날짜 설정
    $('input[name="date_type-chk"]').on('change', function() {
        var $start = $(this).closest('.date_tab').find('input.datepicker').eq(0);
        var $end = $(this).closest('.date_tab').find('input.datepicker').eq(1);
        var tabVal = $(this).closest('label').find('span').text();
        var today = new Date();
        var startDate = new Date();
        var endDate = today;

        if(tabVal === '1일') {
            startDate = today;
            endDate = today;
        } else if(tabVal === '1주일') {
            startDate.setDate(today.getDate() - 7);
        } else if(tabVal === '1개월') {
            startDate.setMonth(today.getMonth() - 1);
        } else if(tabVal === '전체') {
            startDate = '';
            endDate = '';
        }

        if(startDate) $start.datepicker('setDate', startDate);
        else $start.val('');
        if(endDate) $end.datepicker('setDate', endDate);
        else $end.val('');
    });

    //datepicker - 로드 시 date_tab check 값에 따라 날짜 설정
    $('.date_tab').each(function () {
        $('input[name="date_type-chk"]:checked').trigger('change');
    });

    //외부 영역 클릭 시
    $(document).on('click', function (e) {
        //user - 닫기
        if (!$(e.target).closest('header .ico_user').length) {
            $('header .ico_user').removeClass('open');
            $('.header_user').stop(true, true).fadeOut(200);
        }

        //select - 내부 클릭 시 동작 없음
        if ($(e.target).closest('.select_box').length) return;

        //select - 닫기
        closeAllSelect();
    });
});

//loading - 열기
function loadingShow($trigger) {
    const loadingHtml = `
        <div class="loading_wrap">
            <div class="loading_box">
                <ol>
                    <li class="item"></li>
                    <li class="item"></li>
                    <li class="item"></li>
                    <li class="item"></li>
                    <li class="item"></li>
                    <li class="item"></li>
                    <li class="item"></li>
                    <li class="item"></li>
                </ol>
            </div>
        </div>`;
    if ($trigger && $trigger.length) {
        const $inBox = $trigger.closest('.loading_inBox');
        if ($inBox.length) {
            $inBox.append(loadingHtml);
            $inBox.find('.loading_wrap').fadeIn(200);
            return;
        }
    }
    const $loadingEl = $(loadingHtml).addClass('full');
    $('body').append($loadingEl);
    $('body > .loading_wrap').fadeIn(200);
}

//loading - 닫기
function loadingHide($trigger) {
    if ($trigger && $trigger.length) {
        const $inBox = $trigger.closest('.loading_inBox');
        if ($inBox.length) {
            $inBox.find('.loading_wrap').fadeOut(200, function(){
                $inBox.find('.loading_wrap').remove();
            });
            return;
        }
    }
    $('body > .loading_wrap').fadeOut(200, function(){
        $('body > .loading_wrap').remove();
    });
}