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

	if (windowWidth <= 1536) {
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

	if (windowWidth <= 1536) {
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

$(function () {
	handleApplyCollapse($('#header-navigation > ul'), true, true);
	handleCallMenu();
	$(window).resize(function () {
		handleApplyCollapse($('#header-navigation > ul'));
		handleCallMenu();
	});
});
