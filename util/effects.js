const addRippleOnClick = (node) => {
    node.classList.add("clickable-ripple");

    node.addEventListener("click", (evt) => {
        const rippleEffect = document.createElement("span");
        rippleEffect.className = "ripple-effect";
        
        var rect = evt.currentTarget.getBoundingClientRect();
        rippleEffect.style.left = `${evt.clientX - rect.left}px`;
        rippleEffect.style.top = `${evt.clientY - rect.top}px`;

        rippleEffect.addEventListener('animationend', () => { node.removeChild(rippleEffect) }, false);

        node.appendChild(rippleEffect);
    });
}