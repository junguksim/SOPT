const responseMessage = {
    WRITE_FILE_SUCCESS : 'DATA 쓰기 성공',
    WRITE_FILE_FAIL : 'DATA 쓰기 실패',
    APPEND_ROW_SUCCESS : '정보 추가 성공',
    APPEND_ROW_FAIL : '정보 추가 실패',
    READ_FILE_SUCCESS : 'DATA 읽기 성공',
    READ_FILE_FAIL : 'DATA 읽기 실패',
    HAVE_SAME_TITLE : '제목이 중복됨',
    ID_OR_PASSWORD_INCORRECT : 'ID나 비밀번호가 일치하지 않음',
    DATA_CHANGE_SUCCESS : 'DATA 수정 성공',
    DATA_CHANGE_FAIL : 'DATA 수정 실패',
    DATA_DELETE_SUCCESS : 'DATA 삭제 성공',
    NO_USER_IN_DATA : '해당하는 유저가 없거나, 유저의 게시글이 없음',
    NULL_VALUE : '입력되지 않은 값이 존재함'
}

module.exports = responseMessage;