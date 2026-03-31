$(function(){
    //confirm - 열기
    $(document).on('click', '.confirm_open', function(){
        if(!$(this).hasClass('no_draw')) {
            const dataType = $(this).data('type');
            let confirmTit = '';
            let confirmTxt = '';
            let confirmBtn = '';
            
            const btnTemplates = {
                okOnly: `<button type="button" class="btn gray confirm_close">확인</button>`,
                okMove: `<button type="button" class="btn gray confirm_close">취소</button>
                            <a href="javascript:history.back()" class="btn primary">확인</a>`,
                okClose: `<button type="button" class="btn gray confirm_close">취소</button>
                            <button type="button" class="btn primary confirm_close">확인</button>`
            };

            switch(dataType){
                case 'logout':
                    confirmTit = '로그아웃'
                    confirmTxt = '로그아웃 하시겠습니까?<br>확인 버튼을 누르시면 로그인 페이지로 이동합니다.';
                    confirmBtn = `<button type="button" class="btn gray confirm_close">취소</button>
                                <a href="../../login.html" class="btn primary">확인</a>`;
                break;
                case 'cancel':
                    confirmTit = '작업 취소'
                    confirmTxt = '작업을 <span class="t_md c_red">취소</span>하시겠습니까?<br>취소 시 이전 페이지로 이동합니다.';
                    confirmBtn = btnTemplates.okMove;
                break;
                case 'insert':
                    confirmTit = '작업 등록'
                    confirmTxt = '<span class="t_md c_primary">등록</span>하시겠습니까?<br>등록 후에도 수정 작업이 가능합니다.';
                    confirmBtn = btnTemplates.okMove;
                break;
                case 'update':
                    confirmTit = '작업 수정'
                    confirmTxt = '<span class="t_md c_primary">수정</span>하시겠습니까?<br>수정 내용은 즉시 반영됩니다.';
                    confirmBtn = btnTemplates.okMove;
                break;
                case 'stats_ok':
                    confirmTit = '상태 변경 성공'
                    confirmTxt = '상태 변경이 <span class="t_md c_primary">완료</span> 되었습니다.';
                    confirmBtn = btnTemplates.okOnly;
                break;
                case 'stats_no':
                    confirmTit = '상태 변경 실패'
                    confirmTxt = '상태 변경이 <span class="t_md c_red">실패</span> 하였습니다.';
                    confirmBtn = btnTemplates.okOnly;
                break;
                case 'excel':
                    confirmTit = '엑셀 다운로드'
                    confirmTxt = '엑셀 파일로 다운로드 됩니다.<br>진행 하시겠습니까?';
                    confirmBtn = btnTemplates.okClose;
                break;
            }
    
            let confirmHtml = `<div class="confirm_wrap">
                                    <section class="confirm_box sm">
                                        <div class="confirm_tit">
                                            <h2>${confirmTit}</h2>
                                            <button type="button" class="close confirm_close"></button>
                                        </div>
                                        <div class="confirm_content">
                                            <p>${confirmTxt}</p>
                                            <div class="btn_box confirm_btn">${confirmBtn}</div>
                                        </div>
                                    </section>
                                </div> `
            $('body').append(confirmHtml);
            $('.confirm_wrap').not('.fix').fadeIn(200);
        } else {
            $('.confirm_wrap.fix').fadeIn(200);
        }
    });

    //confirm - 닫기
    $(document).on('click', '.confirm_close', function(){
        if(!$(this).hasClass('no_remove')) {
            $(this).closest('.confirm_wrap').fadeOut(200, function(){
                $(this).closest('.confirm_wrap').remove();
            });
        } else{ 
            $(this).closest('.confirm_wrap').fadeOut(200, function(){
                $(this).closest('.confirm_wrap').trigger('confirm:closed');
            });
        }
    });
});