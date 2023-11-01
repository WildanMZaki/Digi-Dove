var counter = 0;
var rowMembers = [];
let bearer;
let basic;

$('#submit').click((e) => {
    e.preventDefault();
    if (!validateParamsForm()) { return; }

     var url = $('#urlInp').val();
     var met = $('#methodSelect').val();
     var data = serializeMyForm();
     var data2 = $('#paramsForm').serialize()
     
    // Clear response area
    $('#myResp').html('')
    sendAJAX(req(url, met, data));
});

function serializeMyForm(){ 
    var serResult = [];
    $('.keys').each((i, item) => {
        serResult.push(item.value+'='+$('.values')[i].value);
    });
    return ''+serResult.join('&')+'';
}

function validateParamsForm(){
    return true;
}

function req(url, method, data, dataType = "JSON") {
    return  {
        url: url,
        method: method,
        data: data,
        dataType: dataType
    };
}

function sendAJAX(request){    
    $.ajax({
        url : request.url,
        type: request.method,
        data: request.data,
        dataType: request.dataType,
        headers: {
            'Authorization': bearer ? `Bearer ${bearer}` : (basic ? `Basic ${basic}` : ''),
        },
        success: function(data, textStatus, jqXHR)
        {
            console.log(data);            
            $('#myResp').get(0).textContent = JSON.stringify(data, null, 2);
            // $('#myResp').html(jqXHR.responseText)
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            const erorr = JSON.parse(jqXHR.responseText);
            $('#myResp').get(0).textContent = JSON.stringify(erorr, null, 2);

            // alert('Error');        
            // console.log(jqXHR.responseText, '\n', textStatus, '\n', errorThrown);            
        }
    });
}

$('#paramsForm').hide()

$('#addParamsBtn').click((e) => { 
    var isClicked = parseInt($('#addParamsBtn').data('clicked'));
    if (!isClicked) {
        $('#paramsForm').show();
        addRowParam();
        addDisRow();
        $('#addParamsBtn').addClass('btn-danger');
        $('#addParamsBtn').removeClass('btn-success');
        $('#addParamsBtn').html('Remove All Params');
        $('#addParamsBtn').data('clicked', '1');
        $(`#key${counter}`).focus()
    } else {
        $('#tableParams').html('');
        $('#paramsForm').hide();
        $('#addParamsBtn').removeClass('btn-danger');
        $('#addParamsBtn').addClass('btn-success');
        $('#addParamsBtn').html('Add Parameters');
        $('#addParamsBtn').data('clicked', '0');
        counter = 0;
        rowMembers = [];
    }

});
function addRowParam() {
    counter++
    rowMembers.push(counter);
    $('#tableParams').append(`
        <tr class="rows" id="row${counter}">
            <td>${rowMembers.length}</td>
            <td class=""><input type="text" name="keys[]" id="key${counter}" placeholder="Key" title="Input key" class="keys w-100 mx-2" required></td>
            <td class=""><input type="text" name="values[]" id="value${counter}" placeholder="Value" title="Input value" class="values w-100 mx-2" required></td>
            <td class="btnc w-auto m-0 d-flex justify-content-end">
                <button type="button" title="Reset this parameter" data-row="${counter}" class="resetRow">R</button>
                <button type="button" title="Disable this parameter" data-row="${counter}" data-en="1" class="mx-1 disenRow">D</button>
                <button type="button" title="Remove this parameter" data-row="${counter}" class="removeRow">X</button>
            </td>
        </tr>
    `);
}

function addDisRow() {
    $('#tableParams').append(`
        <tr class="" id="disRow">
            <td><button type="button" title="Add params" id="addNewParamBtn">+</button></td>
            <td class=""><input type="text" name="keys[]" id="" placeholder="Key" title="Input key" class="w-100 mx-2 bgdis" required></td>
            <td class=""><input type="text" name="values[]" id="" placeholder="Value" title="Input value" class="w-100 mx-2 bgdis" required></td>
            <td class="btnc w-auto m-0 d-flex justify-content-end">
                <button type="button" title="Reset this parameter" disabled>R</button>
                <button type="button" title="Disable this parameter" class="mx-1" disabled>D</button>
                <button type="button" title="Remove this parameter" disabled>X</button>
            </td>
        </tr>        
    `);
}

$('#tableParams').on('click', '.removeRow', (e) => {
     var r = e.currentTarget.dataset.row;
     rowMembers.splice(rowMembers.indexOf(parseInt(r)), 1);
     $(`#row${r}`).remove();
     $('.rows').each((i, e) => {
        e.children[0].innerHTML = i+1;
     });
})

$('#tableParams').on('click', '.resetRow', (e) => {
     var r = e.currentTarget.dataset.row;
     $(`#key${r}`).val('');
     $(`#value${r}`).val('');
     $(`#key${r}`).focus();
})

$('#tableParams').on('click', '.disenRow', (e) => {
     var r = e.currentTarget.dataset.row;
     var isEn = parseInt(e.currentTarget.dataset.en);     
     if (isEn) {
        $(`#key${r}`).attr('disabled', true);
        $(`#value${r}`).attr('disabled', true);
        $(`#key${r}`).removeClass('keys');
        $(`#value${r}`).removeClass('values');
        e.currentTarget.dataset.en = '0';
        e.currentTarget.innerHTML = 'E'
    } else {
        $(`#key${r}`).attr('disabled', false);
        $(`#value${r}`).attr('disabled', false);
        $(`#key${r}`).addClass('keys');
        $(`#value${r}`).addClass('values');
        e.currentTarget.dataset.en = '1';
        e.currentTarget.innerHTML = 'D'
    }
});

$('#tableParams').on('click', '#addNewParamBtn', () => addP());
$('#tableParams').on('click', '.bgdis', () => addP());
$('#tableParams').on('focus', '.bgdis', () => addP());

function addP() {
    $('#disRow').remove();
    addRowParam();
    addDisRow();
    $(`#key${counter}`).focus();
}
