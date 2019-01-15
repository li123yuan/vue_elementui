<template>
    <div style="margin:0 auto">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" class="demo-ruleForm" style="width: 900px;margin:0 auto">
            <el-form-item label="安装包路径" prop="inputInstallPackFile">
                <!--<el-input v-model="ruleForm.name"></el-input>-->
                <el-input
                        placeholder="请输入安装包路径"
                        v-model="ruleForm.inputInstallPackFile"
                        style="width: 500px"
                        clearable>
                </el-input>
                <el-button type="primary" size="medium" @click="loadInstallPackFile(ruleForm.inputInstallPackFile)">加载</el-button>
            </el-form-item>
            <el-row>
                <el-col :span="24"><div class="grid-content bg-purple-dark"><span class="margin30">升级基本信息配置</span></div></el-col>
            </el-row>
            <el-form-item label="服务名称" prop="serviceName">
                <el-select v-model="ruleForm.serviceName" placeholder="请选择" @change="changeServiceName()">
                    <el-option
                            v-for="item in serviceOptions"
                            :key="item.label"
                            :label="item.label"
                            :value="item.label">
                    </el-option>
                </el-select>
            </el-form-item>
            <div v-show="true">
                <el-form-item label="服务Code" prop="serviceCode">
                    <el-select v-model="ruleForm.serviceCode" placeholder="请选择" disabled >
                        <el-option
                                v-for="item in serviceOptions"
                                :key="item.code"
                                :label="item.code"
                                :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
            </div>
            <el-form-item label="版本号" prop="inputUpgradePackCode">
                <!--<el-col :span="4">-->
                <el-input
                        placeholder="请输入版本号"
                        v-model="ruleForm.inputUpgradePackCode"
                        style="width: 500px"
                        clearable>
                </el-input>
                <!--</el-col>-->
            </el-form-item>
            <el-form-item label="服务类型" prop="radioServiceType">
                <el-radio-group v-model="ruleForm.radioServiceType" @change="showPanelClick()">
                    <el-radio label="1">标准服务</el-radio>
                    <el-radio label="2">WEB服务</el-radio>
                    <!--<el-radio label="3">数据库升级</el-radio>-->
                </el-radio-group>
            </el-form-item>
            <el-form-item label="升级信息" prop="upgradeDesc">
                <el-input type="textarea" v-model="ruleForm.upgradeDesc"></el-input>
            </el-form-item>
            <el-alert title="警告" type="warning"
                      description="标准服务和WEB服务的bin目录一般不需要升级,除非确定要升级，才勾选bin目录下文件。
                      WEB服务的conf目录下一般也不需要升级， 并且server.xml中的端口配置每个项目不同，不能随意打到升级包中。"
                      show-icon :closable="false">
            </el-alert>
            <el-form-item label="文件选择" prop="installPackFileList">
                <div style="overflow-y:auto; overflow-x:auto; width:600px; height:200px;" v-show="installFileSelectPanelShow">
                <el-tree
                        :data="installPackFileList"
                        show-checkbox
                        ref="tree"
                        node-key="id"
                        :props="defaultProps">
                </el-tree>
                </div>

            </el-form-item>
            <el-alert v-show="upgradePolicyXmlAlertShow" title="警告" type="warning"
                      description="policy.xml的升级会覆盖原有的XML文件，务必谨慎升级，因为升级xml可能会改变服务的策略配置。另外policy.xml也会在一定周期后被刷新为数据库中保存的服务策略，此处升级替换没有实际意义。所以一般默认都选择否！"
                      show-icon :closable="false">
            </el-alert>
            <el-form-item label="是否升级policy.xml" prop="isUpgradePolicyXml">
                <el-radio-group v-model="ruleForm.isUpgradePolicyXml" @change="showUpgradePolicyXmlAlertShowClick()">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="2">否</el-radio>
                    <!--<el-radio label="3">数据库升级</el-radio>-->
                </el-radio-group>
            </el-form-item>



            <!--<el-row>
                <el-col :span="24"><div class="grid-content bg-purple-dark"><span class="margin30">升级内容配置</span></div></el-col>
            </el-row>-->
            <el-row>
                <el-col :span="24"><div class="grid-content bg-purple-dark"><span class="margin30">标准服务和WEB服务config目录文件升级</span></div></el-col>
            </el-row>
            <el-form-item label="配置文件" prop="configFileName">
                <el-select v-model="configFileName" placeholder="请选择">
                    <el-option
                            v-for="item in configFileNameOptions"
                            :key="item.label"
                            :label="item.label"
                            :value="item.label">
                    </el-option>
                </el-select>
                <el-button type="primary" size="medium" @click="addConfigFile(configFileName)">添加</el-button>
            </el-form-item>

            <el-form-item
                    v-for="fileName in ruleForm.configFiles"
                    :label="fileName.key + '修改内容'"
                    :key="fileName.key"
                    :prop="fileName.key">
                <el-input v-model="fileName.value" type="textarea" style="width: 500px"></el-input>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click.prevent="removeConfigFile(fileName)"></el-button>
            </el-form-item>

            <div v-show="allConfPanelShow">
                <el-row>
                    <el-col :span="24"><div class="grid-content bg-purple-dark"><span class="margin30">WEB服务conf目录文件升级</span></div></el-col>
                </el-row>
                <el-form-item label="conf配置文件" prop="confFileName">
                    <el-select v-model="confFileName" placeholder="请选择">
                        <el-option
                                v-for="item in confFileNameOptions"
                                :key="item.label"
                                :label="item.label"
                                :value="item.label">
                        </el-option>
                    </el-select>
                    <el-button type="primary" size="medium" @click="addConfFile(confFileName)">添加</el-button>
                </el-form-item>

                <el-form-item
                        v-for="fileName in ruleForm.confFiles"
                        :label="fileName.key + '修改内容'"
                        :key="fileName.key"
                        :prop="fileName.key">
                    <el-input v-model="fileName.value" type="textarea" style="width: 500px"></el-input>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click.prevent="removeConfFile(fileName)"></el-button>
                </el-form-item>
            </div>

            <div v-show="allLibPanelShow">
                <el-row>
                    <el-col :span="24"><div class="grid-content bg-purple-dark"><span style="margin-left: 50px">标准服务lib目录升级</span></div></el-col>
                </el-row>
                <el-form-item label="是否整个目录替换" prop="isReplaceDirectory">
                    <el-radio-group v-model="ruleForm.isReplaceDirectory" @change="showLibPanelClick()">
                        <el-radio label="true">是</el-radio>
                        <el-radio label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                    <div v-show="libPanelShow">
                    <el-form-item label="新文件" prop="newLibFileName">
                        <el-select v-model="newLibFileName" placeholder="请选择新文件" style="width: 600px">
                            <el-option
                                    v-for="item in newLibFileNameOptions"
                                    :key="item.label"
                                    :label="item.label"
                                    :value="item.label">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="老文件" prop="oldLibFileName">
                        <el-input placeholder="请输入老文件名称" v-model="oldLibFileName" style="width: 600px" clearable></el-input>
                        <div style="margin: 5px 50px">
                        <el-button type="primary" size="medium" @click="addLibFile(newLibFileName, oldLibFileName)">添加</el-button>
                        </div>
                    </el-form-item>
                    <el-form-item label="lib文件修改内容" prop="changeLibFileString">
                        <div v-for="(libInfo,index) in ruleForm.changeLibFile" style="margin-top: 3px">
                            <el-input v-model="libInfo.libStr" type="text" style="width: 600px" readonly="readonly">></el-input>
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click.prevent="removeLibFile(libInfo)"></el-button>
                        </div>
                        <!--<el-input v-model="ruleForm.changeLibFileString" type="textarea" :autosize="{ minRows: 4, maxRows: 8}" style="width: 600px"></el-input>-->
                        <!--<el-button type="danger" icon="el-icon-delete" size="mini" @click.prevent="removeConfFile(fileName)"></el-button>-->
                    </el-form-item>
                    </div>
            </div>
            <div style="margin: 30px 0;text-align: center">

                <el-button type="primary" @click="submitForm()">生 成 升 级 包</el-button>

            </div>
            <el-button plain @click="open8">
            </el-button>

        </el-form>

    </div>
</template>
<script>

export default {
  data() {
    return {
        libPanelShow:false,
        allLibPanelShow: true,
        allConfPanelShow: false,
        installFileSelectPanelShow: false,
        upgradePolicyXmlAlertShow: false,
        ruleForm: {
            inputInstallPackFile: '',
            serviceName: '',
            serviceCode: '',
            inputUpgradePackCode: '',
            radioServiceType: '1',
            upgradeDesc: '',
            configFiles: [],
            confFiles: [],
            isReplaceDirectory: 'true',
            changeLibFileString: '',
            changeLibFile: [], //[{ newFile:'aa.txt',oldFile:  'bb.txt',str:  'aa.txt > bb.txt'}]
            fileTreeNode: [],
            isUpgradePolicyXml: '2'
        },
        configFileName_arr: [],
        confFileName_arr: [],
        newLibFileName_arr: [],
        configFileName: '',
        confFileName: '',
        newLibFileName: '无',
        oldLibFileName: '',

        rules: {
            inputInstallPackFile: [
                { required: true, message: '请填写安装包路径', trigger: 'change' }
            ],
            serviceName: [
                { required: true, message: '请选择服务名称', trigger: 'change' }
            ],
            serviceCode: [
                { required: true, message: '请选择服务Code', trigger: 'change' }
            ],
            inputUpgradePackCode: [
                { required: true, message: '请填写版本号', trigger: 'blur' }
            ],
            upgradeDesc: [
                { required: true, message: '请填写升级信息', trigger: 'blur' }
            ]
        },

       /* serviceOptions: [{ value:'CEMS-SERVICE-ALARM',label:  'CEMS-SERVICE-ALARM'},
            {value:'CEMS-SERVICE-DATASYNC',label:  'CEMS-SERVICE-DATASYNC'},
            {value:'CEMS-SERVICE-NOTICE',label:  'CEMS-SERVICE-NOTICE'},
            {value:'CEMS-SERVICE-CACHE',label:  'CEMS-SERVICE-CACHE'},
            {value:'CEMS-SERVICE-SUPGRADE',label:  'CEMS-SERVICE-SUPGRADE'},
            {value:'CEMS-SERVICE-DATAPROCESS',label:  'CEMS-SERVICE-DATAPROCESS'},
            {value:'CEMS-SERVICE-POLICY',label:  'CEMS-SERVICE-POLICY'},
            {value:'CEMS-SERVICE-UPDOWNLOAD',label:  'CEMS-SERVICE-UPDOWNLOAD'},
            {value:'CEMS-SERVICE-ADDRESS',label:  'CEMS-SERVICE-ADDRESS'},
            {value:'CEMS-SERVICE-TASK',label:  'CEMS-SERVICE-TASK'},
            {value:'CEMSOMP',label:  'CEMSOMP'},
            {value:'CEMS-SERVICE-CUPGRADE',label:  'CEMS-SERVICE-CUPGRADE'},
            {value:'CEMS',label:  'CEMS'},
            {value:'CEMS-C-UDP',label:  'CEMS-C-UDP'},
            {value:'CEMS-C-TCP',label:  'CEMS-C-TCP'},
            {value:'CEMS-SERVICE-TOAUTH',label:  'CEMS-SERVICE-TOAUTH'},
            {value:'CEMS-SERVICE-CONFIGURE',label:  'CEMS-SERVICE-CONFIGURE'},
            {value:'CEMS-SERVICE-DEVREG',label:  'CEMS-SERVICE-DEVREG'},
            {value:'CEMS-SERVICE-CA',label:  'CEMS-SERVICE-CA'},
            {value:'CEMS-SERVICE-MONITOR',label:  'CEMS-SERVICE-MONITOR'},
            {value:'CEMS-SERVICE-ONLINE',label:  'CEMS-SERVICE-ONLINE'},
            {value:'CEMS-SERVICE-IFACE',label:  'CEMS-SERVICE-IFACE'},
            {value:'CEMS-SERVICE-DATAMAINTAIN',label:  'CEMS-SERVICE-DATAMAINTAIN'}],*/
        serviceOptions: [{ code:'00FF0100',label: 'CEMS-SERVICE-CONFIGURE'},
            { code:'00FF1100',label: 'CEMS-SERVICE-SCAN'},
            { code:'00011A00',label: 'CEMS-SERVICE-COLLECT'},
            { code:'00FF0900',label: 'CEMS-SERVICE-UPDOWNLOAD'},
            { code:'00FF0400',label: 'CEMS-SERVICE-SUPGRADE'},
            { code:'00FF0A00',label: 'CEMS-SERVICE-DATAPROCESS'},
            { code:'00FF1300',label: 'CEMS-SERVICE-ONLINE'},
            { code:'00FFFF00',label: 'CEMS'},
            { code:'00FF0200',label: 'CEMS-C-TCP'},
            { code:'00FF1800',label: 'CEMS-SERVICE-POLICY'},
            { code:'00FF0500',label: 'CEMS-SERVICE-MONITOR'},
            { code:'00FF1900',label: 'CEMS-SERVICE-DATAMAINTAIN'},
            { code:'00FF1C00',label: 'CEMS-SERVICE-LOGPUSH'},
            { code:'00FF0600',label: 'CEMS-SERVICE-ADDRESS'},
            { code:'00FF1000',label: 'CEMS-SERVICE-ALARM'},
            { code:'00FF1B01',label: 'CEMS-SERVICE-DEVREG'},
            { code:'00011200',label: 'CEMS-SERVICE-PTP'},
            { code:'00020100',label: 'CEMS-SERVICE-UDISK'},
            { code:'00FF1200',label: 'CEMS-SERVICE-WORKFLOW'},
            { code:'00FF1A00',label: 'CEMS-SERVICE-CASCADE'},
            { code:'00FF0C00',label: 'CEMS-SERVICE-CA'},
            { code:'00FF0F00',label: 'CEMS-SERVICE-DATASYNC'},
            { code:'00FF0800',label: 'CEMS-SERVICE-CUPGRADE'},
            { code:'00FF0700',label: 'CEMS-SERVICE-CACHE'},
            { code:'00FF1400',label: 'CEMS-SERVICE-TRANS'},
            { code:'00FF1600',label: 'CEMS-SERVICE-TASK'},
            { code:'00FFEE00',label: 'CEMSUP'},
            { code:'00011800',label: 'CEMS-SERVICE-JJFX'},
            { code:'00010400',label: 'CEMS-SERVICE-BLOCK'},
            { code:'00FF0300',label: 'CEMS-C-UDP'},
            { code:'00010600',label: 'CEMS-SERVICE-PATCH'},
            { code:'00FF0B00',label: 'CEMS-SERVICE-TOAUTH'},
            {code:'00FF0D00',label:  'CEMS-SERVICE-IFACE'}
            ],

        serviceCodeInfo: { 'CEMS-SERVICE-CONFIGURE' : '00FF0100',
            'CEMS-SERVICE-SCAN' : '00FF1100',
            'CEMS-SERVICE-COLLECT' : '00011A00',
            'CEMS-SERVICE-UPDOWNLOAD' : '00FF0900',
            'CEMS-SERVICE-SUPGRADE' : '00FF0400',
            'CEMS-SERVICE-DATAPROCESS' : '00FF0A00',
            'CEMS-SERVICE-ONLINE' : '00FF1300',
            'CEMS' : '00FFFF00',
            'CEMS-C-TCP' : '00FF0200',
            'CEMS-SERVICE-POLICY' : '00FF1800',
            'CEMS-SERVICE-MONITOR' : '00FF0500',
            'CEMS-SERVICE-DATAMAINTAIN' : '00FF1900',
            'CEMS-SERVICE-LOGPUSH' : '00FF1C00',
            'CEMS-SERVICE-ADDRESS' : '00FF0600',
            'CEMS-SERVICE-ALARM' : '00FF1000',
            'CEMS-SERVICE-DEVREG' : '00FF1B01',
            'CEMS-SERVICE-PTP' : '00011200',
            'CEMS-SERVICE-UDISK' : '00020100',
            'CEMS-SERVICE-WORKFLOW' : '00FF1200',
            'CEMS-SERVICE-CASCADE' : '00FF1A00',
            'CEMS-SERVICE-CA' : '00FF0C00',
            'CEMS-SERVICE-DATASYNC' : '00FF0F00',
            'CEMS-SERVICE-CUPGRADE' : '00FF0800',
            'CEMS-SERVICE-CACHE' : '00FF0700',
            'CEMS-SERVICE-TRANS' : '00FF1400',
            'CEMS-SERVICE-TASK' : '00FF1600',
            'CEMSUP' : '00FFEE00',
            'CEMS-SERVICE-JJFX' : '00011800',
            'CEMS-SERVICE-BLOCK' : '00010400',
            'CEMS-C-UDP' : '00FF0300',
            'CEMS-SERVICE-PATCH' : '00010600',
            'CEMS-SERVICE-IFACE' : '00FF0D00',
            'CEMS-SERVICE-TOAUTH' : '00FF0B00'},

        configFileNameOptions: [],

        confFileNameOptions: [],

        newLibFileNameOptions: [{ id:'',label:  '无'}],

        installPackFileList: [{
            id: 1,
            label: '请加载安装包',
            value: 'test',
            children: []
        }],

        installConfigInfo: {
            serviceName: '',
            serviceCode: '',
            serviceVersion: ''
        },
/*
        installPackFileList: [{
            id: 1,
            label: '一级 1',
            value: 'qqqqqq',
            children: [{
                id: 4,
                label: '二级 1-1',
                value: 'qqqqqq2',
                children: [{
                    id: 9,
                    label: '三级 1-1-1',
                    value: 'qqqqqq3'
                }, {
                    id: 10,
                    label: '三级 1-1-2',
                    value: 'qqqqqq4'
                }]
            }]
        }],
*/

        // installPackFileList: [],
        defaultProps: {
            children: 'children',
            label: 'label'
        }
    };
  },
  created() {

  },
  methods: {

      submitSuccessNotify() {
          this.$notify({
              type: 'info',
              title: '提示',
              message: '升级包生成的位置和安装包目录同级，文件夹名称如：upgrade_CEMS-SERVICE-XX',
              position: 'bottom-right',
              duration: 0,
              offset: 100
          });
      },

      loadInstallMessage(result,message) {
          this.$message({
              message: message,
              type: result
          });
      },


      submitSuccessMessage() {
          this.$alert('请求发送成功，后台正在处理中。', '成功', {
              confirmButtonText: '确定',
              type: 'success',
              center: true
          });
      },

      showInstallFileSelectPanelClick: function() {
          this.installFileSelectPanelShow = true;
      },

      showLibPanelClick: function() {
          this.libPanelShow = !this.libPanelShow;
      },

      showUpgradePolicyXmlAlertShowClick: function() {
          if (this.ruleForm.isUpgradePolicyXml === "1") {
              this.upgradePolicyXmlAlertShow = true;
          }else {
              this.upgradePolicyXmlAlertShow = false;
          }
      },

      showPanelClick: function() {
          console.log(this.ruleForm.radioServiceType);
          if (this.ruleForm.radioServiceType === "1") {
              this.allLibPanelShow = true;
              this.allConfPanelShow = false;
          }else{
              this.allLibPanelShow = false;
              this.allConfPanelShow = true;

          }
      },

      changeServiceName() {
          console.log(this.ruleForm.serviceName);
          console.log(this.serviceCodeInfo[this.ruleForm.serviceName]);
        this.ruleForm.serviceCode = this.serviceCodeInfo[this.ruleForm.serviceName];
      },

      removeConfigFile(item) {
          var index = this.ruleForm.configFiles.indexOf(item);
          console.log(index);
          if (index !== -1) {
              this.ruleForm.configFiles.splice(index, 1)
          }

          var index2 = this.configFileName_arr.indexOf(item.key);
          console.log(index2);
          if (index2 !== -1) {
              this.configFileName_arr.splice(index2, 1)
          }
      },
      addConfigFile(item) {
          if (item == "") {
              return;
          }

          var index2 = this.configFileName_arr.indexOf(item);
          console.log(index2);
          if (index2 !== -1) {
              return;
          }else {
              this.configFileName_arr.push(item);
          }

          this.ruleForm.configFiles.push({
              value: '',
              key: item
          });
      },
      removeConfFile(item) {
          var index = this.ruleForm.confFiles.indexOf(item)
          if (index !== -1) {
              this.ruleForm.confFiles.splice(index, 1)
          }

          var index2 = this.confFileName_arr.indexOf(item.key);
          console.log(index2);
          if (index2 !== -1) {
              this.confFileName_arr.splice(index2, 1)
          }
      },
      addConfFile(item) {
          if (item == "") {
              return;
          }

          var index2 = this.confFileName_arr.indexOf(item);
          console.log(index2);
          if (index2 !== -1) {
              return;
          }else {
              this.confFileName_arr.push(item);
          }
          this.ruleForm.confFiles.push({
              value: '',
              key: item
          });
      },
      addLibFile(newFile, oldFile) {
          if (newFile.toString() === "" && oldFile.toString() === "") {
            return;
          }
          if (newFile.toString() === "无" && oldFile.toString() === "") {
              return;
          }
          if (newFile.toString() === "无") {
              newFile = "";
          }else {
              //添加到newLibFileName_arr，用于判断不能重复添加
              var index2 = this.newLibFileName_arr.indexOf(newFile);
              console.log(index2);
              if (index2 !== -1) {
                  return;
              }else {
                  this.newLibFileName_arr.push(newFile);
              }
          }
          var libString = newFile.toString() + ' > ' + oldFile.toString();
          this.ruleForm.changeLibFile.push({
              newFile: newFile,
              oldFile: oldFile,
              libStr: libString
          });
          console.log(this.ruleForm.changeLibFile);
          console.log(libString);
          this.ruleForm.changeLibFileString += newFile.toString() + ' > ' + oldFile.toString() + '\n';
          // this.ruleForm.changeLibFileStringArr.push(newFile.toString() + ' > ' + oldFile.toString());
      },
      removeLibFile(item) {
          var index = this.ruleForm.changeLibFile.indexOf(item)
          if (index !== -1) {
              this.ruleForm.changeLibFile.splice(index, 1)
          }

          var index2 = this.newLibFileName_arr.indexOf(item.newFile);
          console.log(index2);
          if (index2 !== -1) {
              this.newLibFileName_arr.splice(index2, 1)
          }
      },

      loadInstallPackFile(filePath) {
          if (filePath == ""){
              return;
          }
          console.log(filePath);
          // var filePaths;
          if (filePath.indexOf("\\") != -1){
              var filePaths = filePath.split("\\");
              this.ruleForm.serviceName = filePaths[filePaths.length - 1];
              this.changeServiceName();
          } else if (filePath.indexOf("\/")  != -1) {
              var filePaths = filePath.split("\/");
              this.ruleForm.serviceName = filePaths[filePaths.length - 1];
              this.changeServiceName();
          }


          this.$http.post("/api/loadInstallPack", {paramPath:filePath}, {emulateJSON:true}).then(result => {
              // 注意： 通过 $http 获取到的数据，都在 result.body 中放着
              var result = result.body;
              if (result.code === 200) {
                  // 成功了
                  console.log(result.data);
                  this.installPackFileList = result.data.installPackFileList;
                  this.installConfigInfo = result.data.installConfigInfo;
                  this.ruleForm.inputUpgradePackCode = result.data.installConfigInfo.serviceVersion;
                  console.log(this.installPackFileList);

                  for (let i = 0;i < this.installPackFileList.length;i++){
                      var item = this.installPackFileList[i];
                      console.log(item);
                      if (item.label === "config") {
                          this.configFileNameOptions = item.children;
                          console.log(this.configFileNameOptions);
                      }else if(item.label === "conf") {
                          this.confFileNameOptions = item.children;
                      }else if(item.label === "lib") {
                          this.newLibFileNameOptions = JSON.parse(JSON.stringify(item.children));
                          // this.newLibFileNameOptions = item.children;
                          console.log(this.newLibFileNameOptions);
                          this.newLibFileNameOptions.push({ id:'',label:  '无'});
                          console.log(this.newLibFileNameOptions);
                      }
                  }
                  this.showInstallFileSelectPanelClick();
                  this.loadInstallMessage('success', '加载成功！');
              } else {
                  // 失败了
                  this.loadInstallMessage('error', '加载失败！');
              }
          });

      },

      submitForm() {
          this.$refs['ruleForm'].validate((valid) => {
              if (valid) {
                  console.log("test----------------");

                  // getCheckedNodes();

                  console.log(this.$refs.tree.getCheckedNodes());
                  // console.log(this.$refs.tree.getHalfCheckedNodes());

                  this.ruleForm.fileTreeNode = this.$refs.tree.getCheckedNodes();

                  // headers: {'Content-Type': 'application/json;charset=UTF-8'
              // , {'Content-Type': 'application/json;charset=UTF-8'}

                  this.$http.post("/api/makeUpgradePack", this.ruleForm, {headers:{'Content-Type': 'application/json;charset=UTF-8'}}).then(result => {
                      // 注意： 通过 $http 获取到的数据，都在 result.body 中放着
                      var result = result.body;
                      if (result.code === 200) {
                          // 成功了
                          console.log(result.data);

                      } else {
                          // 失败了
                          alert("提交失败！");
                      }
                  });

                  this.submitSuccessMessage();
                  this.submitSuccessNotify();
              } else {
                  console.log('error submit!!');
                  return false;
              }
          });
      },
      resetForm(formName) {
          this.$refs[formName].resetFields();
      }
  }
};
</script>


<style>
    .el-row {
        margin-bottom: 20px;
    &:last-child {
         margin-bottom: 0;
     }
    }
    .el-col {
        border-radius: 4px;
    }
    .bg-purple-dark {
        background: #99a9bf;
    }
    .bg-purple {
        background: #d3dce6;
    }
    .bg-purple-light {
        background: #e5e9f2;
    }
    .grid-content {
        margin-left: 50px;
        border-radius: 4px;
        min-height: 36px;
        line-height: 36px;
    }
    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
    .margin30{
        margin-left: 30px;
    }
</style>