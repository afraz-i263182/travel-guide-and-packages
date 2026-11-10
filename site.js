
// Small JavaScript enhancements for the Travel Postcard website.
// All interactions run in the browser.

// Wait until the HTML page has completely loaded.
document.addEventListener('DOMContentLoaded', function () {

    // ==========================================
    // 1. DESTINATION CATEGORY FILTERS
    // ==========================================

    const destinationButtons = document.querySelectorAll('[data-destination-filter]');
    const destinationCards = document.querySelectorAll('.destination-tile');
    const destinationEmpty = document.querySelector('.filter-empty:not([data-package-empty])');

    destinationButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const selected = button.dataset.destinationFilter;

            destinationButtons.forEach(function (item) {
                const active = item === button;
                item.classList.toggle('active', active);
                item.setAttribute('aria-pressed', String(active));
            });

            let visibleCount = 0;

            destinationCards.forEach(function (card) {
                const matches = selected === 'all' ||
                    card.dataset.category.split(' ').includes(selected);

                card.hidden = !matches;

                if (matches) {
                    visibleCount += 1;
                }
            });

            if (destinationEmpty) {
                destinationEmpty.hidden = visibleCount !== 0;
            }
        });
    });


    // ==========================================
    // 2. PACKAGE DURATION FILTERS
    // ==========================================

    const packageButtons = document.querySelectorAll('[data-package-filter]');
    const packageCards = document.querySelectorAll('.package-card');
    const packageEmpty = document.querySelector('[data-package-empty]');

    packageButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const selected = button.dataset.packageFilter;

            packageButtons.forEach(function (item) {
                const active = item === button;
                item.classList.toggle('active', active);
                item.setAttribute('aria-pressed', String(active));
            });

            let visibleCount = 0;

            packageCards.forEach(function (card) {
                const matches = selected === 'all' ||
                    card.dataset.duration === selected;

                card.hidden = !matches;

                if (matches) {
                    visibleCount += 1;
                }
            });

            if (packageEmpty) {
                packageEmpty.hidden = visibleCount !== 0;
            }
        });
    });


    // ==========================================
    // 3. PACKAGE PRESELECTION
    // ==========================================

    const packageSelect = document.getElementById('package-select');

    if (packageSelect) {

        const requestedPackage =
            new URLSearchParams(window.location.search).get('package');

        if (
            requestedPackage &&
            Array.from(packageSelect.options).some(function (option) {
                return option.value === requestedPackage;
            })
        ) {
            packageSelect.value = requestedPackage;
        }

        document.querySelectorAll('[data-select-package]').forEach(function (link) {

            link.addEventListener('click', function () {

                const packageId = link.dataset.selectPackage;

                if (
                    Array.from(packageSelect.options).some(function (option) {
                        return option.value === packageId;
                    })
                ) {
                    packageSelect.value = packageId;
                }

            });

        });
    }


    // ==========================================
    // 4. SET MINIMUM TRAVEL DATE
    // ==========================================

    const dateInput = document.getElementById('travel-date');

    if (dateInput) {

        const today = new Date();

        const localToday = new Date(
            today.getTime() - today.getTimezoneOffset() * 60000
        ).toISOString().split('T')[0];

        dateInput.min = localToday;
    }


    // ==========================================
    // 5. BOOKING FORM SUBMISSION
    // ==========================================

    const bookingForm = document.getElementById('booking-form');
    const feedback = document.getElementById('booking-feedback');

    if (bookingForm && feedback) {

        bookingForm.addEventListener('submit', function (event) {

            // Prevent the page from refreshing.
            event.preventDefault();

            // Check whether all required fields are completed.
            if (!bookingForm.reportValidity()) {
                return;
            }

            // Display success message using window.alert().
            window.alert("Form submitted successfully");

            // Display message in the browser console.
            console.log("Form submitted successfully");


            // ==================================
            // 6. DISPLAY BOOKING INQUIRY PREVIEW
            // ==================================

            const data = new FormData(bookingForm);

            const selectedPackage = packageSelect.options[
                packageSelect.selectedIndex
            ].text;

            const customerName = String(
                data.get('fullName')
            ).trim();

            const travellers = String(
                data.get('travellers')
            );

            const travelDate = String(
                data.get('travelDate') || 'Not specified'
            );

            // Clear previous feedback.
            feedback.replaceChildren();

            // Display customer name.
            const heading = document.createElement('strong');

            heading.textContent =
                'Your inquiry preview is ready, ' + customerName + '.';

            // Display booking details.
            const details = document.createElement('span');

            details.textContent =
                'Package: ' + selectedPackage +
                ' | Travellers: ' + travellers +
                ' | Preferred date: ' + travelDate +
                '. This is a classroom demonstration only: your details have not been sent or saved. Contact the travel provider directly to confirm availability and booking.';

            feedback.append(heading, details);

            feedback.hidden = false;

            feedback.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });

        });
    }

});
