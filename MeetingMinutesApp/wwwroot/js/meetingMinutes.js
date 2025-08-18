$(document).ready(function () {
    let products = [];
    let selectedProducts = [];

    // 🔹 Load customers based on radio
    function loadCustomers() {
        let type = $("input[name='customerType']:checked").val();
        $.getJSON(`/Meeting/GetCustomers?type=${type}`, function (data) {
            let ddl = $("#customerSelect");
            ddl.empty();
            ddl.append(`<option value="">-- Select Customer --</option>`);
            $.each(data, function (i, c) {
                ddl.append(`<option value="${c.id}">${c.name}</option>`);
            });
        });
    }

    // 🔹 Load products
    function loadProducts() {
        $.getJSON(`/Meeting/GetProducts`, function (data) {
            products = data;
            let ddl = $("#productSelect");
            ddl.empty();
            ddl.append(`<option value="">-- Select Product/Service --</option>`); 
            $.each(products, function (i, p) {
                ddl.append(`<option value="${p.id}">${p.name}</option>`);
            });

            $("#unitBox").val("");
        });
    }

    // 🔹 When product changes, set unit
    $("#productSelect").change(function () {
        let id = $(this).val();
        let product = products.find(p => p.id == id);
        $("#unitBox").val(product ? product.unit : "");
    });

    // 🔹 Add row to table
    $("#addRowBtn").click(function (e) {
        e.preventDefault();
        let id = $("#productSelect").val();
        let qty = $("#qtyBox").val();
        let unit = $("#unitBox").val();
        let product = products.find(p => p.id == id);

        if (!id || !qty) {
            showMsg("Please select product and enter quantity", "danger");
            return;
        }

        let item = {
            productServiceId: parseInt(id),
            productServiceName: product.name,
            quantity: parseInt(qty),
            unit: unit
        };

        selectedProducts.push(item);
        renderTable();
        $("#qtyBox").val("");
    });

    // 🔹 Render product table
    function renderTable() {
        let tbody = $("#detailsTable tbody");

        if (!selectedProducts || selectedProducts.length === 0) {
            tbody.html(`<tr><td colspan="5" class="text-center text-muted">No matching records found</td></tr>`);
            return;
        }

        let rows = "";
        $.each(selectedProducts, function (i, item) {
            rows += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${item.productServiceName}</td>
                    <td>${item.quantity}</td>
                    <td>${item.unit}</td>
                    <td>
                        <button class="btn btn-sm btn-warning editRow" data-index="${i}">Edit</button>
                        <button class="btn btn-sm btn-danger deleteRow" data-index="${i}">Delete</button>
                    </td>
                </tr>
            `;
        });
        tbody.html(rows);
    }

    // 🔹 Edit row
    $(document).on("click", ".editRow", function () {
        let index = $(this).data("index");
        let item = selectedProducts[index];

        // Fill form with row values
        $("#productSelect").val(item.productServiceId).change();
        $("#qtyBox").val(item.quantity);
        $("#unitBox").val(item.unit);

        // Remove old row (will be re-added after update)
        selectedProducts.splice(index, 1);
        renderTable();
    });

    // 🔹 Delete row
    $(document).on("click", ".deleteRow", function () {
        let index = $(this).data("index");
        selectedProducts.splice(index, 1);
        renderTable();
    });

    // 🔹 Save meeting
    $("#saveBtn").click(function (e) {
        e.preventDefault();

        //validation check
        let formValues = validateForm();
        if (!formValues) return;

        let data = {
            customerType: $("input[name='customerType']:checked").val(),
            customerId: parseInt(formValues.customerId),
            meetingPlace: $("#meetingPlace").val(),
            agenda: $("#meetingAgenda").val(),
            discussion: $("#meetingDiscussion").val(),
            decision: $("#meetingDecision").val(),
            clientSide: $("#attendsClient").val(),
            hostSide: $("#attendsHost").val(),
            meetingDate: formValues.meetingDate,
            meetingTime: formValues.meetingTime,
            details: selectedProducts
        };


        $.ajax({
            url: "/Meeting/Save",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (res) {
                if (res.success) {
                    showMsg("Meeting saved successfully!", "success");

                    //  Clear product list array
                    selectedProducts.length = 0;

                    // table reset 
                    $("#detailsTable tbody").html(
                        `<tr><td colspan="5" class="text-center text-muted">No matching records found</td></tr>`
                    );

                    //Clear inputs related to products
                    $("#qtyBox").val("");
                    $("#unitBox").val("");

                    resetForm();

                } else {
                    showMsg("Error: " + res.message, "danger");
                }
            }
,
            error: function () {
                showMsg("Unexpected error while saving.", "danger");
            }
        });
    });

    //validation func
    function validateForm() {
        let meetingDate = $("#meetingDate").val();
        let meetingTime = $("#meetingTime").val();
        let customerId = $("#customerSelect").val();

        if (!meetingDate) {
            showMsg("Please select a meeting date", "danger");
            return false;
        }

        let timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;
        if (!meetingTime || !timeRegex.test(meetingTime)) {
            showMsg("Please select a valid time (e.g. 09:30 AM)", "danger");
            return false;
        }

        if (!customerId || customerId === "0") {
            showMsg("Please select a customer", "danger");
            return false;
        }

        if (!$("#meetingPlace").val().trim()) {
            showMsg("Please enter Meeting Place", "danger");
            return false;
        }

        if (!$("#meetingAgenda").val().trim()) {
            showMsg("Please enter Meeting Agenda", "danger");
            return false;
        }

        if (!$("#meetingDiscussion").val().trim()) {
            showMsg("Please enter Meeting Discussion", "danger");
            return false;
        }

        if (!$("#meetingDecision").val().trim()) {
            showMsg("Please enter Meeting Decision", "danger");
            return false;
        }

        if (!$("#attendsClient").val().trim()) {
            showMsg("Please enter Attendees from Client Side", "danger");
            return false;
        }

        if (!$("#attendsHost").val().trim()) {
            showMsg("Please enter Attendees from Host Side", "danger");
            return false;
        }

        if (selectedProducts.length === 0) {
            showMsg("Please add at least one product/service", "warning");
            return false;
        }

        return {
            meetingDate,
            meetingTime,
            customerId
        };
    }



    // 🔹 Refresh button
    $("#refreshBtn").click(function (e) {
        e.preventDefault();
        resetForm();
    });

    // 🔹 Utility: Show message
    function showMsg(message, type) {
        $("#msgBox").html(`<div class="alert alert-${type}">${message}</div>`);
        setTimeout(() => { $("#msgBox").html(""); }, 4000);
    }

    // 🔹 Utility: Reset form
    function resetForm() {
        // Reset all form inputs
        $("#meetingForm")[0].reset();

        // Reset customer type
        $("input[name='customerType'][value='Corporate']").prop("checked", true);

        // Reload dropdowns
        loadCustomers();
        loadProducts();

        // Reset date & time
        $('#meetingDate').datepicker('update', '');
        $('#meetingTime').timepicker('setTime', '09:00 AM');

        // Clear product list & table
        selectedProducts.length = 0; // ✅ safer than reassigning []
        renderTable();

        // Clear messages
        $("#msgBox").html("");
    }

    // 🔹 Init
    $("input[name='customerType']").change(loadCustomers);
    loadCustomers();
    loadProducts();
    renderTable();
});

// Bootstrap Datepicker
$('#meetingDate').datepicker({
    format: "yyyy-mm-dd",   
    todayHighlight: true,
    autoclose: true
});

// Bootstrap timepicker
$('#meetingTime').timepicker({
    timeFormat: 'h:mm p',   
    interval: 30,            
    minTime: '12:00am',   
    maxTime: '11:59pm',    
    defaultTime: 'now',     
    dynamic: false,
    dropdown: true,
    scrollbar: true
});


