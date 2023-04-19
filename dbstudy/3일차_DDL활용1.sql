-- 테이블 삭제 (외래키를 가진 테이블을 먼저 삭제해야 한다.)
DROP TABLE CUSTOMER;
DROP TABLE BANK;


-- BANK 테이블 생성
CREATE TABLE BANK (
    BANK_CODE VARCHAR2(20) PRIMARY KEY,
    BANK_NAME VARCHAR2(30)
);

-- CUSTOMER 테이블 생성
CREATE TABLE CUSTOMER (
    NO NUMBER PRIMARY KEY,
    NAME VARCHAR2(30) NOT NULL,
    PHONE VARCHAR2(30) UNIQUE,
    AGE NUMBER CHECK(AGE BETWEEN 0 AND 100),
    BANK_CODE VARCHAR2(20) REFERENCES BANK(BANK_CODE)
);