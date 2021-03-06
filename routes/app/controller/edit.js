/**
 * Created by mooner00 on 8/23/2016.
 */
app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items)
{
    $scope.detail = items

    $scope.ok = function ()
    {
        $uibModalInstance.close()
    }

    $scope.cancel = function ()
    {
        $uibModalInstance.dismiss('cancel')
    }

    $scope.print = function()
    {
        printdiv('printElement')
    }
    function printdiv(printdivname)
    {
        var headstr = "<html><head><title>Booking Details</title></head><body>";
        var footstr = "</body>";
        var newstr = document.getElementById(printdivname).innerHTML;
        var newWindow = window.open('');
        newWindow.document.body.innerHTML = headstr+newstr+footstr;
        newWindow.print();
        return false;
    }

    $scope.download = function()
    {
        downloadDiv('printElement','data.html')
    }

    function downloadDiv(divName,filename)
    {
        var data = document.getElementById(divName).innerHTML
        var file = new File([data], filename, {type: "text/html;charset=utf-8"});
        saveAs(file);
    }
})

app.controller('edit',function($scope,$uibModal, dataService)
{

    $scope.totalItems = 10
    $scope.currentPage = 1
    $scope.pageSize = 5
    $scope.editInfo = true;
    $scope.predicate = 'name';
    $scope.reverse = true;
    $scope.all = Symbol("all")
    $scope.complete = Symbol("complete")
    $scope.incomplete = Symbol("incomplete")

    $scope.changePageSize = function(num)
    {
        $scope.pageSize = num
    }

    $scope.order = function (predicate)
    {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
        console.log($scope.predicate)
    }

    $scope.displayDownload = false

    $scope.display = function()
    {
        var result = false
        $scope.users.forEach(function (element)
        {
            if (element.flag == true) result = true
        })
        
        $scope.displayDownload = result
        return result
    }

    $scope.changeUser = function (symbol)
    {
        console.log($scope.users)
        //$scope.allUsers[0].progress = 100
        switch (symbol)
        {
            case $scope.all: 
            {
                //console.log(1)
                $scope.users = $scope.allUsers
                $scope.totalItems = $scope.users.length
                return
            }
            case $scope.complete: 
            {
                //console.log(2)
                $scope.users = $scope.allUsers.filter(function (element)
                {
                    return element.progress == 100
                })
                $scope.totalItems = $scope.users.length
                return 
            }
            case $scope.incomplete:
            {
                //console.log(3)
                $scope.users = $scope.allUsers.filter(function (element)
                {
                    return element.progress != 100
                })
                $scope.totalItems = $scope.users.length
                return
            }
        }
    }

    $scope.paginate = function (value)
    {
        var begin, end, index;
        begin = ($scope.currentPage - 1) * $scope.pageSize;
        end = begin + $scope.pageSize;
        index = $scope.users.indexOf(value);
        return (begin <= index && index < end);
    }

    $scope.employeeDetail = false
    $scope.allUsers = []
    $scope.users = [{id : 0,first_name:'test',description:'on project',status:'due',dob:'1/1/1995',e_id:0,job_title:'projector',age:10},{id : 1,name:'er',dob:'1/1/1',age:3}]

    $scope.select = true

    $scope.selectAll = function ()
    {

        $scope.users.forEach(function(element)
        {
            if($scope.select)
        {
            element.flag = true
        }
        else
        {
            element.flag = false

        }
        $scope.display()
    })
        return $scope.select = !$scope.select
    }



    $scope.$on('changeData',function(event,info)
    {
        if(info.data == null || info.data == '')
        {
            return //alert('Error: no fetched employee')
        }
        else
        {
            //console.log(info)
            info.data.forEach(function(element)
            {
                for (i in element)
                {
                    if(!element.hasOwnProperty(i)) continue
                    else element[i] = parseISO8601(element[i])
                }
                element.flag = false
            })
        }
        $scope.users = info.data
        $scope.totalItems = $scope.users.length
    })

    $scope.printAll = function ()
    {
        var headstr = "<html><head><title>Booking Details</title></head><body>";
        var footstr = "</body>";
        var newstr = ""
        var oldstr = document.body.innerHTML;

        $scope.users.forEach(function(element)
        {
            if (element.flag == true)
            {
                var formatedData = getFormatedData(element)
                forEach(formatedData,function(key,value)
                {
                    if(value != null && value != undefined)
                    {
                        newstr += key + " : " + value + "<br>"
                    }
                })
                newstr += "<br><br>"
             
            }
        })

        var data = headstr+newstr+footstr;
        var newWindow = window.open("");
        newWindow.document.body.innerHTML = data;
        newWindow.print();
        return false;

    }


    $scope.downloadAll = function()
    {
        var data = ''
        var filename = 'information.html'
        $scope.users.forEach(function(element)
        {
            if (element.flag == true)
            {
                var formatedData = getFormatedData(element)
                forEach(formatedData,function(key,value)
                {
                    if(value != null && value != undefined)
                    {
                        data += key + " : " + value + "<br>"
                    }
                })
                data += "<br><br>"
             
            }
    })
        var file = new File([data], filename, {type: "text/html;charset=utf-8"});
        saveAs(file);

    }

    $scope.detail = {}

    $scope.showEmployeeDetail = function(id)
    {
        if($scope.employeeDetail == false)
        {
            //console.log('first')
            $scope.employeeDetail = true
            //console.log('second')
            $scope.users.forEach(function(element) {if (element.e_id == id) $scope.detail = element})
            //console.log('third')
            $scope.open()
        }
        else
        {
            $scope.users.forEach(function(element) {if (element.e_id == id) $scope.detail = element})
            $scope.open()
        }
    }

    $scope.animationsEnabled = true

    $scope.open = function (size)
    {
        
        var modalInstance = $uibModal.open
        ({
            animation: $scope.animationsEnabled,
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve:
            {
                items: function ()
                {
                    return $scope.detail
                }
            }
        })

    }

    $scope.alerts = []
    $scope.addAlert = function(type,msg)
    {
        if ($scope.alerts.length == 0) $scope.alerts.push({type: type,msg: msg});
    }
    $scope.closeAlert = function(index)
    {
        $scope.alerts.splice(index, 1);
        init();
    }

    $scope.deleteUser = function(id){
        dataService.deleteAllById(id,function(e,o){
            if(e){
                $scope.addAlert('danger','Fail to delete the employee');
            }else{
                $scope.addAlert('success','Employee has been deleted');
            }
        })

    }

    $scope.editUser = function(id)
    {        
        //console.log('id = ' + id)
        window.location.href = window.location + 'edit/' + id
        //$scope.editInfo = false;
        $scope.$emit('editUser',{id:id});
    }

    init();

    function init(){
        dataService.getAllBySql(function(e,o){
            if(o){
                $scope.users = o;
                $scope.users.forEach(function(element)
                {
                    for (i in element)
                    {
                        if(!element.hasOwnProperty(i)) continue
                        else element[i] = parseISO8601(element[i])
                    }
                    element.flag = false
                })
                $scope.totalItems = o.length;
                $scope.allUsers = $scope.users
            }
            else{
                $scope.users = []
            }
        })


    }

    var getFormatedData = function(people)
    {
        var formatedData = 
        {
            name: people.first_name + people.last_name,
            cellphone: people.cellphone,
            email: people.email,
            SSN: people.ssn,
            birthday: people.dob,
            company: people.company_name,
            insurance: people.health_ins,
            job_level: people.job_level,
            job_title: people.job_title,
            location: people.location,
            salary: people.salary,
            degree: people.degree,
            university: people.university,
            payrise_percentage: people.payrise_precentage || people.payrise_percentage,
            visa_start_time: people.start_time,
            visa_end_time: people.end_time,

        }
        return formatedData
    }

})



/**
 * Created by mooner00 on 8/24/2016.
 */
