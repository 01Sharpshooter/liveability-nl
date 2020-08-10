const addRippleOnClick = (node) => {
    const elem = $(node);
    elem.addClass("clickable-ripple");
    elem.on("click", (evt) => {
        const rippleEffect = evt.currentTarget.getElementsByClassName("ripple-effect")[0];
        if (rippleEffect) evt.currentTarget.removeChild(rippleEffect);

        const eventTarget = $(evt.currentTarget);
        const x = evt.pageX - eventTarget.offset().left;
        const y = evt.pageY - eventTarget.offset().top;

        $('<span class="ripple-effect"/>').appendTo(eventTarget).css({
            left: x,
            top: y
        });
    });
}