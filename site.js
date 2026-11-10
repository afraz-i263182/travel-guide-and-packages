// Small client-side enhancements for the Travel Postcard student project.
// All interactions run in the browser; no customer information is sent to a server.
document.addEventListener('DOMContentLoaded', function () {
    // Destination category filters.
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
                const matches = selected === 'all' || card.dataset.category.split(' ').includes(selected);
                card.hidden = !matches;
                if (matches) visibleCount += 1;
            });
            if (destinationEmpty) destinationEmpty.hidden = visibleCount !== 0;
        });
    });

    // Package duration filters.
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
                const matches = selected === 'all' || card.dataset.duration === selected;
                card.hidden = !matches;
                if (matches) visibleCount += 1;
            });
            if (packageEmpty) packageEmpty.hidden = visibleCount !== 0;
        });
    });

    // Preselect a package from the URL or when a visitor clicks a package card.
    const packageSelect = document.getElementById('package-select');
    if (packageSelect) {
        const requestedPackage = new URLSearchParams(window.location.search).get('package');
        if (requestedPackage && Array.from(packageSelect.options).some(function (option) { return option.value === requestedPackage; })) {
            packageSelect.value = requestedPackage;
        }
        document.querySelectorAll('[data-select-package]').forEach(function (link) {
            link.addEventListener('click', function () {
                const packageId = link.dataset.selectPackage;
                if (Array.from(packageSelect.options).some(function (option) { return option.value === packageId; })) {
                    packageSelect.value = packageId;
                }
            });
        });
    }

    // Set the minimum travel date to today.
    const dateInput = document.getElementById('travel-date');
    if (dateInput) {
        const today = new Date();
        const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];
        dateInput.min = localToday;
    }

    // Demo-only booking inquiry preview. This deliberately does not submit data to a server.
    const bookingForm = document.getElementById('booking-form');
    const feedback = document.getElementById('booking-feedback');
    if (bookingForm && feedback) {
        bookingForm.addEventListener('submit', function (event) {
            event.preventDefault();
            if (!bookingForm.reportValidity()) return;

            const data = new FormData(bookingForm);
            const selectedPackage = packageSelect.options[packageSelect.selectedIndex].text;
            const customerName = String(data.get('fullName')).trim();
            const travellers = String(data.get('travellers'));
            const travelDate = String(data.get('travelDate') || 'Not specified');

            feedback.replaceChildren();
            const heading = document.createElement('strong');
            heading.textContent = 'Your inquiry preview is ready, ' + customerName + '.';
            const details = document.createElement('span');
            details.textContent = 'Package: ' + selectedPackage + ' | Travellers: ' + travellers + ' | Preferred date: ' + travelDate + '. This is a classroom demonstration only: your details have not been sent or saved. Contact the travel provider directly to confirm availability and booking.';
            feedback.append(heading, details);
            feedback.hidden = false;
            feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }
});
