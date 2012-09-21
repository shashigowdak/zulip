function process_hotkey(code) {
    var next_zephyr;

    switch (code) {
    case 40: // down arrow
    case 38: // up arrow
        if (code === 40) {
            next_zephyr = get_next_visible(selected_zephyr);
        } else {
            next_zephyr = get_prev_visible(selected_zephyr);
        }
        if (next_zephyr.length !== 0) {
            select_zephyr(next_zephyr, true);
        }
        if ((next_zephyr.length === 0) && (code === 40)) {
            // At the last zephyr, scroll to the bottom so we have
            // lots of nice whitespace for new zephyrs coming in.
            $("#main_div").scrollTop($("#main_div").prop("scrollHeight"));
        }
        return process_hotkey;

    case 36: // Home: Go to first message
    case 38: // End: Go to last message
        if (code === 38) {
            next_zephyr = get_last_visible();
        } else {
            next_zephyr = get_first_visible();
        }
        if (next_zephyr.length !== 0) {
            select_zephyr(next_zephyr, true);
        }
        if ((next_zephyr.length === 0) && (code === 38)) {
            // At the last zephyr, scroll to the bottom so we have
            // lots of nice whitespace for new zephyrs coming in.
            $("#main_div").scrollTop($("#main_div").prop("scrollHeight"));
        }
        return process_hotkey;

    case 27: // Esc: hide compose pane
        hide_compose();
        return process_hotkey;

    case 82: // 'r': respond to zephyr
        respond_to_zephyr();
        return process_key_in_input;

    case 71: // 'g': start of "go to" command
        return process_goto_hotkey;
    }

    return false;
}

function process_goto_hotkey(code) {
    var zephyr = zephyr_dict[selected_zephyr_id];
    switch (code) {
    case 67: // 'c': narrow by recipient
        narrow_by_recipient(zephyr);
        break;

    case 73: // 'i': narrow by instance
        if (zephyr.type === 'class') {
            narrow_instance();
        }
        break;

    case 80: // 'p': narrow to personals
        narrow_all_personals();
        break;

    case 65: // 'a': un-narrow
        show_all_messages();
        break;

    case 27: // Esc: hide compose pane
        hide_compose();
        break;
    }

    /* Always return to the initial hotkey mode, even
       with an unrecognized "go to" command. */
    return process_hotkey;
}

function process_key_in_input(code) {
    if (code === 27) {
        // User hit Escape key
        hide_compose();
        return process_hotkey;
    }
    return false;
}

/* The current handler function for keydown events.
   It should return a new handler, or 'false' to
   decline to handle the event. */
var keydown_handler = process_hotkey;

$(document).keydown(function (event) {
    var result = keydown_handler(event.keyCode);
    if (typeof result === 'function') {
        keydown_handler = result;
        event.preventDefault();
    }
});
