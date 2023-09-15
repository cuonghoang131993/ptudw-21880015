'use strict';

const helper = {};

helper.createStarList = (stars) => {
    let star = Math.floor(stars);
    let half = stars - star;
    let str = `<div class="ratting">`;
    let i = 0;
    for (i = 0; i < star; i++) {
        str += '<i class="fa fa-star"></i>';
    }
    if (half > 0) {
        str += '<i class="fa fa-star-half"></i>';
        i++;
    }
    while (i < 5) {
        str += '<i class="fa fa-star-o"></i>';
        i++;
    }
    str += '</div>';
    return str;
}

module.exports = helper;