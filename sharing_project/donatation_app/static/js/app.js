document.addEventListener("DOMContentLoaded", function() {
    /**
     * HomePage - Help section
     */
    class Help {
        constructor($el) {
            this.$el = $el;
            this.$buttonsContainer = $el.querySelector(".help--buttons");
            this.$slidesContainers = $el.querySelectorAll(".help--slides");
            this.currentSlide = this.$buttonsContainer.querySelector(".active").parentElement.dataset.id;
            this.init();
        }

        init() {
            this.events();
        }

        events() {
            /**
             * Slide buttons
             */
            this.$buttonsContainer.addEventListener("click", e => {
                if (e.target.classList.contains("btn")) {
                    this.changeSlide(e);
                }
            });

            /**
             * Pagination buttons
             */
            this.$el.addEventListener("click", e => {
                if (e.target.classList.contains("btn") && e.target.parentElement.parentElement.classList.contains("help--slides-pagination")) {
                    this.changePage(e);
                }
            });
        }

        changeSlide(e) {
            e.preventDefault();
            const $btn = e.target;

            // Buttons Active class change
            [...this.$buttonsContainer.children].forEach(btn => btn.firstElementChild.classList.remove("active"));
            $btn.classList.add("active");

            // Current slide
            this.currentSlide = $btn.parentElement.dataset.id;

            // Slides active class change
            this.$slidesContainers.forEach(el => {
                el.classList.remove("active");

                if (el.dataset.id === this.currentSlide) {
                    el.classList.add("active");
                }
            });
        }

        /**
         * TODO: callback to page change event
         */
        changePage(e) {
            e.preventDefault();
            const page = e.target.dataset.page;

            console.log(page);
        }
    }

    const helpSection = document.querySelector(".help");
    if (helpSection !== null) {
        new Help(helpSection);
    }

    /**
     * Form Select
     */
    class FormSelect {
        constructor($el) {
            this.$el = $el;
            this.options = [...$el.children];
            this.init();
        }

        init() {
            this.createElements();
            this.addEvents();
            this.$el.parentElement.removeChild(this.$el);
        }

        createElements() {
            // Input for value
            this.valueInput = document.createElement("input");
            this.valueInput.type = "text";
            this.valueInput.name = this.$el.name;

            // Dropdown container
            this.dropdown = document.createElement("div");
            this.dropdown.classList.add("dropdown");

            // List container
            this.ul = document.createElement("ul");

            // All list options
            this.options.forEach((el, i) => {
                const li = document.createElement("li");
                li.dataset.value = el.value;
                li.innerText = el.innerText;

                if (i === 0) {
                    // First clickable option
                    this.current = document.createElement("div");
                    this.current.innerText = el.innerText;
                    this.dropdown.appendChild(this.current);
                    this.valueInput.value = el.value;
                    li.classList.add("selected");
                }

                this.ul.appendChild(li);
            });

            this.dropdown.appendChild(this.ul);
            this.dropdown.appendChild(this.valueInput);
            this.$el.parentElement.appendChild(this.dropdown);
        }

        addEvents() {
            this.dropdown.addEventListener("click", e => {
                const target = e.target;
                this.dropdown.classList.toggle("selecting");

                // Save new value only when clicked on li
                if (target.tagName === "LI") {
                    this.valueInput.value = target.dataset.value;
                    this.current.innerText = target.innerText;
                }
            });
        }
    }

    document.querySelectorAll(".form-group--dropdown select").forEach(el => {
        new FormSelect(el);
    });

    /**
     * Hide elements when clicked on document
     */
    document.addEventListener("click", function(e) {
        const target = e.target;
        const tagName = target.tagName;

        if (target.classList.contains("dropdown")) return false;

        if (tagName === "LI" && target.parentElement.parentElement.classList.contains("dropdown")) {
            return false;
        }

        if (tagName === "DIV" && target.parentElement.classList.contains("dropdown")) {
            return false;
        }

        document.querySelectorAll(".form-group--dropdown .dropdown").forEach(el => {
            el.classList.remove("selecting");
        });
    });

    /**
     * Switching between form steps
     */
    class FormSteps {
        constructor(form) {
            this.$form = form;
            this.$next = form.querySelectorAll(".next-step");
            this.$prev = form.querySelectorAll(".prev-step");
            this.$step = form.querySelector(".form--steps-counter span");
            this.currentStep = 1;

            this.$stepInstructions = form.querySelectorAll(".form--steps-instructions p");
            const $stepForms = form.querySelectorAll("form > div");
            this.slides = [...this.$stepInstructions, ...$stepForms];

            this.init();
        }

        /**
         * Init all methods
         */
        init() {
            this.events();
            this.updateForm();
        }

        /**
         * All events that are happening in form
         */
        events() {
            // Next step
            this.$next.forEach(btn => {
                btn.addEventListener("click", e => {
                    if (this.currentStep !== 5) {
                        e.preventDefault();
                        this.currentStep++;
                        this.updateForm();
                    } else {
                        e.preventDefault()
                        this.$form.querySelector("form").addEventListener("submit", e => this.submit(e));
                    }
                });
            });

            // Previous step
            this.$prev.forEach(btn => {
                btn.addEventListener("click", e => {
                    e.preventDefault();
                    this.currentStep--;
                    this.updateForm();
                });
            });

            // Form submit
            //this.$form.querySelector("form").addEventListener("submit", e => this.submit(e));
        }

        /**
         * Update form front-end
         * Show next or previous section etc.
         */
        updateForm() {
            this.$step.innerText = this.currentStep;

            // TODO: Validation


            this.slides.forEach(slide => {
                slide.classList.remove("active");

                if (slide.dataset.step == this.currentStep) {
                    slide.classList.add("active");
                }
            });

            this.$stepInstructions[0].parentElement.parentElement.hidden = this.currentStep >= 6;
            this.$step.parentElement.hidden = this.currentStep >= 6;

            // TODO: get data from inputs and show them in summary
        }

        /**
         * Submit form
         *
         * TODO: validation, send data to server
         */
        submit(e) {
            e.preventDefault();
            this.currentStep++;
            this.updateForm();
        }
    }

    const form = document.querySelector(".form--steps");
    if (form !== null) {
        new FormSteps(form);
    }

    const radioButtons = document.querySelectorAll('input[name="categories"]');
    const nextButton = document.querySelector('#next')
    const arrayCategory = [];

    radioButtons.forEach(radioButton => {
        radioButton.addEventListener('change', event => {
            const selectedCategory = event.target.closest('label').getAttribute('data-categories')
            if (event.target.checked) {
                arrayCategory.push(parseInt(selectedCategory))
            } else {
                const index = arrayCategory.indexOf(parseInt(selectedCategory))
                if (index !== -1) {
                    arrayCategory.splice(index, 1)
                }
            }
            console.log('kategoria:', arrayCategory)
        })
    })

    nextButton.addEventListener('click', event => {
        const labels = document.querySelectorAll('label[data-category]')
        labels.forEach(label => {
            const institutionCategories = label.getAttribute('data-category').split(',').filter(Boolean).map(categoryID => parseInt(categoryID))
            console.log(institutionCategories)
            const isMatching = institutionCategories.some(categoryID => arrayCategory.includes(categoryID))
            label.style.display = isMatching ? 'block' : 'none'
        })
    })

    const confirmationButton = document.querySelector('#confirm')
    const summaryText = document.querySelectorAll('.summary--text');
    const summaryList = document.querySelectorAll('.summary--list')

    confirmationButton.addEventListener('click', event => {
        const checkboxes = document.querySelectorAll('input[name="categories"]')
        const selectedCategories = []

        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedCategories.push(checkbox.nextElementSibling.textContent)
            }
        })

        const bagsQuantity = document.querySelector('input[name="bags"]').value

        const organization = document.querySelector('input[name="organization"]:checked')
        const selectedOrganization = organization ? organization.parentElement.querySelector('[name="organization-name"]').textContent : null
        console.log(selectedOrganization)

        const selectedStreet = document.querySelector('input[name="address"]').value
        const selectedCity = document.querySelector('input[name="city"]').value
        const selectedPostcode = document.querySelector('input[name="postcode"]').value
        const selectedPhone = document.querySelector('input[name="phone"]').value
        const selectedDate = document.querySelector('input[name="data"]').value
        const selectedTime = document.querySelector('input[name="time"]').value
        const selectedInfo = document.querySelector('textarea[name="more_info"]').value


        let text = ""
        if (selectedCategories.length > 0) {
            text = selectedCategories.join(', ')
        }
        summaryText[0].textContent = `${bagsQuantity} worków z kategorii: ${text}`
        summaryText[1].textContent = `Dla fundacji ${selectedOrganization}`

        const newLi1 = document.createElement("li")
        const newLi2 = document.createElement("li")
        const newLi3 = document.createElement("li")
        const newLi4 = document.createElement("li")
        const newLi5 = document.createElement("li")
        const newLi6 = document.createElement("li")
        const newLi7 = document.createElement("li")
        summaryList[0].appendChild(newLi1).textContent = `Telefon: ${selectedPhone}`
        summaryList[0].insertBefore(newLi2, newLi1).textContent = `Kod pocztowy: ${selectedPostcode}`
        summaryList[0].insertBefore(newLi3, newLi2).textContent = `Miasto: ${selectedCity}`
        summaryList[0].insertBefore(newLi4, newLi3).textContent = `Ulica: ${selectedStreet}`

        summaryList[1].appendChild(newLi5).textContent = `Uwagi: ${selectedInfo}`
        summaryList[1].insertBefore(newLi6, newLi5).textContent = `Godzina: ${selectedTime}`
        summaryList[1].insertBefore(newLi7, newLi6).textContent = `Data: ${selectedDate}`
    });
});