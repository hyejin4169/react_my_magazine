const getCookie = (name) => {
    let value = "; " + document.cookie;

    let parts = value.split(`; ${name}=`); // [aa=xx / aaa; abbb=sssss;]
    //쪼개주기

    if (parts.length === 2) {
        return parts.pop().split(";").shift(); //pop은 parts라는 원본 배열 맨 뒤에 있는 것을 떼주는 것, 그 후 ()안에 반환 / shift는 그 반대(앞에 있는 것을 떼어줌)
    }

}

const setCookie = (name, value, exp = 5) => {
    let date = new Date();
    date.setTime(date.getTime() + exp * 24 * 60 * 60 * 1000);

    document.cookie = `${name}=${value}; expires=${date.toUTCString}`;

};

const deleteCookie = (name) => {
    let date = new Date("2020-01-01").toUTCString();

    console.log(date);

    document.cookie = name+"=; expires="+date;

};

export {getCookie, setCookie, deleteCookie};