var windowWidth = document.documentElement.clientWidth;
window.addEventListener("resize", () => {
    windowWidth = document.documentElement.clientWidth;
});

let handleApplyCollapse = function ($parent, $firstItem = false, $callFunction = false) {
    let $childUl = $parent.find('> li > ul');
    if ($childUl.length === 0) {
        return;
    }

    if ($callFunction) {
        $parent.find('> li a').each(function () {
            $(this).attr('data-href', $(this).attr('href'))
        });
    }

    if (windowWidth <= 991) {

        let $objParentAttr = {};
        let $objChildrenAttr = {
            'data-bs-parent': '#' + $parent.attr('id')
        }

        if ($firstItem) {
            let $parentID = 'menu-' + Math.random().toString(36).substring(7);
            $parent.attr('id', $parentID);
            $objParentAttr = {
                'data-bs-parent': '#' + $parentID
            }

            $objChildrenAttr = {};
        }

        $childUl.each(function () {
            let $parentUl = $(this).closest('ul');
            let $parentListItem = $(this).closest('li');
            let $parentListItemAnchor = $parentListItem.children('a');

            let $parentUlID = 'menu-' + Math.random().toString(36).substring(7);

            $parentUl.addClass('collapse').attr({
                'id': 'collapse-' + $parentUlID, ...$objParentAttr, ...$objChildrenAttr
            });

            $parentListItemAnchor.replaceWith(function () {
                return `<button aria-label="${$parentListItemAnchor.attr('aria-label')}" data-href="${$parentListItemAnchor.attr('data-href')}" data-bs-toggle="collapse" data-bs-target="#${$parentUl.attr('id')}">${$parentListItemAnchor.html()}</button>`
            })

            handleApplyCollapse($parentUl, false);

            $parentUl.on('show.bs.collapse', function () {
                $parent.find('.collapse.show').not($parentUl).collapse('hide');
            });
        });
    } else {
        $parent.removeAttr('id');

        $childUl.each(function () {
            let $parentUl = $(this).closest('ul');
            let $parentListItem = $(this).closest('li');

            $parentUl.removeClass('collapse').removeAttr('data-bs-parent id');
            $parentListItem.children('a').attr('href', $parentListItem.children('a').attr('data-href'));

            $parentListItem.children('button').replaceWith(function () {
                return `<a aria-label="${$(this).attr('aria-label')}" href="${$(this).attr('data-href')}" data-href="${$(this).attr('data-href')}">${$(this).html()}</a>`
            })

            handleApplyCollapse($parentUl);
        });
    }
}

let handleCallMenu = function () {
    const $body = $('body');
    const handleBody = function ($toggle = false) {
        if ($body.hasClass('is-navigation')) {
            $body.removeClass('is-navigation');
            if ($body.hasClass('is-overflow')) {
                $body.removeClass('is-overflow');
            }

            $('#header-navigation ul').collapse('hide');
        } else {
            if ($toggle) {
                $body.addClass('is-navigation is-overflow')
            }
        }
    }

    if (windowWidth <= 991) {
        const $hamburger = $('#hamburger-button');
        if ($hamburger.length) {
            $hamburger.click(function () {
                handleBody(true)
            });
        }

        const $overlay = $('#header-overlay');
        if ($overlay.length) {
            $overlay.click(function () {
                handleBody();
            });
        }
    } else {
        handleBody();
    }
}

const handleStickHeader = function () {
    $(window).scroll(function (e) {
        if ($(document).scrollTop() > $('#header').innerHeight()) {
            $('#header').addClass('is-scroll');
        } else {
            $('#header').removeClass('is-scroll');
        }
    });
}


const handleCopyValue = function () {
    const copyButtons = document.querySelectorAll('.button-copy');
    if (copyButtons) {
        copyButtons.forEach(function (copyButton) {
            copyButton.addEventListener('click', function () {
                const valueToCopy = copyButton.getAttribute('data-value');

                const tempTextArea = document.createElement('textarea');
                tempTextArea.style.cssText = 'position: absolute; left: -99999px';
                tempTextArea.setAttribute("id", "textareaCopy");
                document.body.appendChild(tempTextArea);

                let textareaElm = document.getElementById('textareaCopy');
                textareaElm.value = valueToCopy;
                textareaElm.select();
                textareaElm.setSelectionRange(0, 99999);
                document.execCommand('copy');

                document.body.removeChild(textareaElm);

                if (copyButton.getAttribute('data-bs-toggle') === 'tooltip') {
                    copyButton.setAttribute('title', 'Đã sao chéo');

                    const tooltip = bootstrap.Tooltip.getInstance(copyButton);
                    tooltip.setContent({'.tooltip-inner': 'Đã sao chéo'})
                }
            });
        })
    }
}

const handleInitFancybox = function () {
    if ($('.initFancybox').length) {
        $('.initFancybox').each(function () {
            let elm = $(this);
            Fancybox.bind(`[data-fancybox=${elm.attr('data-fancybox')}]`, {
                thumbs: {
                    autoStart: true,
                },
            });
        });
    }
}
const handleContentDetail = () => {
    if ($('#detailContent').length > 0) {
        if ($('#detailContent img').length > 0) {
            $('#detailContent img').each((index, elm) => {
                $(elm).wrap(`<a style="cursor: zoom-in" href="${$(elm).attr('src')}" data-caption="${$(elm).attr('alt')}" data-fancybox="images-detail"></a>`);
            });

            Fancybox.bind('[data-fancybox]', {
                thumbs: {
                    autoStart: true,
                },
            });
        }

        if ($('#detailContent table').length > 0) {
            $('#detailContent table').map(function () {
                $(this).addClass('table table-bordered');
                $(this).wrap('<div class="table-responsive"></div>');
            })
        }
    }
}

const handleSliderImagesProduct = function () {
    const handleFancyBoxProduct = function (elm, initSliderAvatar, initSliderThumb) {
        let i = 0;
        elm.click(function () {
            i = 0;
        });

        Fancybox.bind(('[data-fancybox=detailGallery]'), {
            touch: true,
            beforeShow: function (instance, current) {
                let index = elm.find(`[data-fancybox='detailGallery'][href='${current.src}']`).attr('data-index');
                initSliderAvatar.slideTo(index - 1);
                if (typeof initSliderThumb !== 'undefined') {
                    initSliderThumb.slideTo(index - 1);
                }
            },
        });
    }

    let sliderAvatar = $('#product-avatar');
    let sliderThumb = $('#product-thumb');

    if (sliderAvatar.length > 0) {
        let initSliderThumb;
        if (sliderThumb.length) {
            initSliderThumb = new Swiper('#product-thumb .swiper', {
                loop: false,
                speed: 1000,
                slidesPerView: 3,
                spaceBetween: 12,
                breakpoints: {
                    320: {
                        slidesPerView: 3.5,
                    },
                    768: {
                        slidesPerView: 3.5,
                    },
                    991: {
                        slidesPerView: 4,
                    },
                    1199: {
                        slidesPerView: 4,
                    }
                },
                autoplay: false,
            });
        }

        let initSliderAvatar = new Swiper('#product-avatar .swiper', {
            loop: false,
            speed: 1000,
            autoplay: {
                delay: 8000,
                disableOnInteraction: true,
            },
            slidesPerView: 1,
            thumbs: {
                swiper: initSliderThumb,
            },
            navigation: {
                nextEl: "#product-avatar .slider-button_next",
                prevEl: "#product-avatar .slider-button_prev",
            },
        });

        handleFancyBoxProduct(sliderAvatar, initSliderAvatar, initSliderThumb);
    }
}
const handleSliderProductRelated = function () {
    if ($('#slider-productRelated').length) {
        new Swiper('#slider-productRelated .swiper', {
            speed: 1000,
            spaceBetween: 15,
            autoplay: {
                delay: 6000,
                disableOnInteraction: true,
            },
            breakpoints: {
                1359: {
                    slidesPerView: 4,
                },
                768: {
                    slidesPerView: 2.5,
                },
                375: {
                    slidesPerView: 1.5,
                },
                320: {
                    slidesPerView: 1,
                }
            },
            pagination: {
                el: '#slider-productRelated .slider-pagination',
                type: 'bullets',
                bulletClass: 'slider-pagination_item',
                clickable: true,
            }
        });
    }
}


const handleSliderPartner = function () {
    if ($('#slider-partner').length) {
        new Swiper('#slider-partner .swiper', {
            speed: 1000,
            spaceBetween: 15,
            autoplay: {
                delay: 6000,
                disableOnInteraction: true,
            },
            breakpoints: {
                1359: {
                    slidesPerView: 6,
                },
                768: {
                    slidesPerView: 2.5,
                },
                375: {
                    slidesPerView: 1.5,
                },
                320: {
                    slidesPerView: 1,
                }
            },
            pagination: {
                el: '#slider-partner .slider-pagination',
                type: 'bullets',
                bulletClass: 'slider-pagination_item',
                clickable: true,
            }
        });
    }
}

const handleFrm = () => {
    $('#formTemp').submit(function () {
        let form = $(this);
        if (!form[0].checkValidity()) {
            form.addClass('was-validated');
        }
        return false;
    });
}

$(function () {
    handleApplyCollapse($('#header-navigation > ul'), true, true);
    handleCallMenu();
    $(window).resize(function () {
        handleApplyCollapse($('#header-navigation > ul'));
        handleCallMenu();
    })
    handleStickHeader();
    handleCopyValue();
    handleInitFancybox();

    handleContentDetail();

    if ($('.callSearch').length) {
        $('.callSearch').click(function () {
            let headerSearch = $(this).closest('.headerSearch');
            headerSearch.toggleClass('is-search')
        });
    }

    handleSliderImagesProduct();
    handleSliderProductRelated();
    handleSliderPartner();

    handleFrm();
});