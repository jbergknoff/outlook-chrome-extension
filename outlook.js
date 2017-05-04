(
  function() {
    const inbox_count_selector = "span[title='Inbox'] + div > span.ms-fcl-tp";
    const set_page_title = () => {
      const inbox_count = ~~document.querySelector(inbox_count_selector).innerText;

      // Match titles like
      //  "Mail - user@domain.com"
      //  "(123) Mail - user@domain.com"
      // and pick out the default title as a group.
      const title_regex = /(\(\d+\) )?(Mail - .*)/;
      const default_title = (title_regex.exec(document.title) || [])[2];

      // If we were on the mail page and then navigated to, e.g., the calendar,
      // then the DOM element still exists but the title has changed. Quit here
      // before corrupting the page title.
      if (!default_title) {
        return;
      }

      document.title = `(${inbox_count}) ${default_title}`;
    };

    var last_notification_count = 0;
    const check_notifications = () => {
      // I couldn't find a way to hook into the `CalendarNotification` events
      // that are being passed around.
      const notification_count = ~~(document.querySelector("span.o365cs-notifications-notificationHeaderText:nth-child(2)") || {}).innerText
      if (notification_count > last_notification_count) {
        alert("Outlook calendar reminder");
      }

      last_notification_count = notification_count;
    };

    const run_stuff = () => {
      const on_mail_page = !!document.querySelector(inbox_count_selector);
      const on_calendar_page = !!document.querySelector("div[aria-label=\"Calendar header\"]");

      if (on_calendar_page) {
        check_notifications();
      } else if (on_mail_page) {
        set_page_title();
      }
    };

    setInterval(run_stuff, 2000);
    run_stuff();
  }
)();
