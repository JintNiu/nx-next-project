export const canvasConfigData = {
  nodes: [
    {
      id: "data_service_1",
      type: "trigger",
      subNodes: null,
    },
    {
      id: "data_service_helper_1",
      type: "data_service_helper",
      subNodes: null,
    },
    {
      id: "data_service_output_1",
      type: "data_service_output",
      subNodes: null,
    },
    {
      id: "object_helper_1",
      type: "normal",
      subNodes: null,
    },
  ],
  configs: {
    data_service_1: {
      id: "data_service_1",
      type: "trigger",
      name: "数据服务触发器",
      nameEn: "Data Service Trigger",
      description: "",
      descriptionEn: "",
      inMainPath: null,
      componentId: "0000000000000vvb",
      componentVersion: 1,
      actionId: "0000000000000vvt",
      certificate: null,
      input: {
        header: {
          key: "header",
          value: {},
          dataType: "object",
        },
        body: {
          key: "body",
          value: {
            a: {
              key: "a",
              dataType: "string",
              value: "",
            },
          },
          dataType: "object",
        },
      },
      output: null,
      errorHandle: null,
      relation: null,
      formConfig: null,
      nodeListener: null,
      dataServiceConfigDTO: null,
      activityCache: null,
    },
    data_service_helper_1: {
      id: "data_service_helper_1",
      type: "data_service_helper",
      name: "数据服务助手",
      nameEn: "Data Service Helper",
      description: "",
      descriptionEn: "",
      inMainPath: null,
      componentId: "0000000000000vvh",
      componentVersion: 1,
      actionId: "0000000000000vvv",
      certificate: null,
      input: {
        header: {
          key: "header",
          value: {},
          dataType: "object",
        },
        body: {
          key: "body",
          value: {
            empocde: {
              key: "empocde",
              dataType: "string",
              value: "",
            },
            list: {
              key: "list",
              dataType: "collection",
              value: [],
            },
            obj: {
              key: "obj",
              dataType: "object",
              value: {},
            },
            bool: {
              key: "bool",
              dataType: "boolean",
              value: false,
            },
            num: {
              key: "num",
              dataType: "number",
            },
            exp: {
              key: "exp",
              dataType: "expression",
              value: "",
            },
            d_str: {
              key: "d_str",
              dataType: "string",
              value: "aaa",
            },
            d_num: {
              key: "d_num",
              dataType: "number",
              value: 9,
            },
            d_bool: {
              key: "d_bool",
              dataType: "boolean",
              value: true,
            },
            d_exp: {
              key: "d_exp",
              dataType: "expression",
              value: "$.config.aaa",
            },
            d_obj: {
              key: "d_obj",
              dataType: "object",
              value: {
                d_obj_child: {
                  key: "d_obj_child",
                  dataType: "string",
                  value: "111",
                },
                d_obj_child2: {
                  key: "d_obj_child2",
                  dataType: "object",
                  value: {},
                },
              },
            },
            d_select: {
              key: "d_select",
              dataType: "collection",
              value: ["option_1"],
            },
            d_list: {
              key: "d_list",
              dataType: "collection",
              value: [],
            },
          },
          dataType: "object",
        },
      },
      output: null,
      errorHandle: {
        errorHandleStrategy: "terminate",
        maxRetryTime: 0,
        retryInterval: 1000,
        condition: null,
      },
      relation: null,
      formConfig: null,
      nodeListener: {
        before: {
          key: "before",
          value: {
            type: {
              key: "type",
              dataType: "string",
              value: "off",
            },
            address: {
              key: "address",
              dataType: "string",
              value: "",
            },
            body: {
              key: "body",
              dataType: "object",
              value: {},
            },
          },
          dataType: "object",
        },
        after: {
          key: "after",
          value: {
            type: {
              key: "type",
              dataType: "string",
              value: "off",
            },
            address: {
              key: "address",
              dataType: "string",
              value: "",
            },
            body: {
              key: "body",
              dataType: "object",
              value: {},
            },
          },
          dataType: "object",
        },
      },
      dataServiceConfigDTO: {
        dataServiceCode: "queryUserList_100058058",
        dataServiceName: null,
        dataServiceContractVersion: "draft",
        appId: "100058058",
        dataSetCode: null,
        dataSetMethodCode: null,
        dataSetVersion: null,
        async: false,
        branchName: null,
      },
      activityCache: {
        enable: false,
        scope: 1,
        expiredSeconds: 1,
      },
    },
    object_helper_1: {
      id: "object_helper_1",
      type: "normal",
      name: "object助手",
      nameEn: "Object",
      description: "",
      descriptionEn: "",
      inMainPath: null,
      componentId: "0000000000000f7u",
      componentVersion: 13,
      actionId: "0000000000000f6f",
      certificate: null,
      input: {
        object: {
          key: "object",
          value: {},
          dataType: "object",
        },
        key: {
          key: "key",
          value: "",
          dataType: "expression",
        },
      },
      output: null,
      errorHandle: {
        errorHandleStrategy: "terminate",
        maxRetryTime: 0,
        retryInterval: 1000,
        condition: "",
      },
      relation: null,
      formConfig: null,
      nodeListener: {
        before: {
          key: "before",
          value: {
            type: {
              key: "type",
              dataType: "string",
              value: "off",
            },
            address: {
              key: "address",
              dataType: "string",
              value: "",
            },
            body: {
              key: "body",
              dataType: "object",
              value: {},
            },
          },
          dataType: "object",
        },
        after: {
          key: "after",
          value: {
            type: {
              key: "type",
              dataType: "string",
              value: "off",
            },
            address: {
              key: "address",
              dataType: "string",
              value: "",
            },
            body: {
              key: "body",
              dataType: "object",
              value: {},
            },
          },
          dataType: "object",
        },
      },
      dataServiceConfigDTO: null,
      activityCache: {
        enable: false,
        scope: 1,
        expiredSeconds: 1,
      },
    },
    data_service_output_1: {
      id: "data_service_output_1",
      type: "data_service_output",
      name: "数据服务输出",
      nameEn: "Data Service Output",
      description: "",
      descriptionEn: "",
      inMainPath: null,
      componentId: "0000000000000vve",
      componentVersion: 1,
      actionId: "0000000000000vvu",
      certificate: null,
      input: {},
      output: null,
      errorHandle: null,
      relation: null,
      formConfig: null,
      nodeListener: null,
      dataServiceConfigDTO: null,
      activityCache: {
        enable: false,
        scope: 1,
        expiredSeconds: 1,
      },
    },
  },
};
