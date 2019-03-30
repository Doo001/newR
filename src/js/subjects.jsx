import Global from 'global';

let subject = "<%SUBJECT%>";
export function getSubject(name = '') {
    return subjects[subject];
}

export function getSubjectByItemType(itemType) {
    return getSubject({
        1: 'math',
        2: 'physics',
        3: 'biology',
        4: 'chemistry',
        5: 'english',
        6: 'chinese',
        7: 'history',
        8: 'polity',
        9: 'geography',
    }[Math.floor(itemType / 1000)]);
}

const subjects = {
    math: {
        id: 1,
        getItemTypeDescs(edu) {
            return ItemTypeDesc.kAll.filter(desc => desc.type > 1000 && desc.type < 2000 && (desc.edu === 0 || desc.edu === edu));
        },
        getKtTypeDescs() {
            return KtTypeDesc.kAll.filter(desc => desc.type > 1000 && desc.type < 2000);
        },
         getKtTypeSearch() {
            return KtTypeDesc.kAll.filter(desc => desc.type >= 1000 && desc.type < 2000 && desc.type != 1888);
        },
        renderInputZone() {
            if (this.state.type === 1001) {
                return <Type1001 ref="inputZone" />;
            } else if (this.state.type === 1002||this.state.type === 1004) {
                return <Type1002 ref="inputZone" />;
            } else if (this.state.type === 1003) {
                return <Type1003 ref="inputZone" />;
            } else {
                return null;
            }
        },
        getAbilities() {
            return [
                { name: 'spatial', displayName: '空间想象能力' },
                { name: 'abstract', displayName: '抽象概括能力' },
                { name: 'reason', displayName: '推理论证能力' },
                { name: 'calc', displayName: '运算求解能力' },
                { name: 'data', displayName: '数据处理能力' },
                { name: 'appl', displayName: '实际应用能力' },
            ];
        },
        getPlanTypes() {
            return [
                { name: 1, displayName: '例题'},
                { name: 2, displayName: '练习题'},
                { name: 3, displayName: '测试题'}
            ]
        },
        getLessonSliceLevel() {
            return {
                1: { value: 1, content : "识记 ☆   "},
                2: { value: 2, content : "理解 ☆☆   "},
                3: { value: 3, content : "操作 ☆☆☆  "},
                4: { value: 4, content : "识别 ☆☆☆☆ "},
                5: { value: 5, content : "迁移 ☆☆☆☆☆ "},
                6: { value: 6, content : "综合☆☆☆☆☆☆"},
            }
        }
    },
    physics: {
        id: 2,
        getItemTypeDescs(edu = 0) {
            if (edu === 0) {
                return ItemTypeDesc.kAll.filter(desc => desc.type >= 2000 && desc.type < 3000);
            } else {
                return ItemTypeDesc.kAll.filter(desc => desc.type >= 2000 && desc.type < 3000 &&
                    (desc.edu === 0 || desc.edu === edu)
                );
            }
        },
        getKtTypeDescs() {
            return KtTypeDesc.kAll.filter(desc => desc.type >= 2000 && desc.type < 3000);
        },
        getKtTypeSearch() {
            return KtTypeDesc.kAll.filter(desc => desc.type >= 2000 && desc.type < 3000 && desc.type != 2888);
        },
        getAbilities() {
            return [
                { name: 'mathapplication', displayName: '数学应用能力' },
                { name: 'comprehension', displayName: '理解能力' },
                { name: 'analysis', displayName: '分析能力' },
                { name: 'experiment', displayName: '实验能力' },
                { name: 'reasoning', displayName: '逻辑推理能力' },
            ];
        },
        getPlanTypes() {
            return [
                { name: 1, displayName: '例题'},
                { name: 2, displayName: '练习题'},
                { name: 3, displayName: '测试题'}
            ]
        },
        getLessonSliceLevel() {
            return {
                1: { value: 1, content : "识记 ☆   "},
                2: { value: 2, content : "理解 ☆☆   "},
                3: { value: 3, content : "操作 ☆☆☆  "},
                4: { value: 4, content : "识别 ☆☆☆☆ "},
                5: { value: 5, content : "迁移 ☆☆☆☆☆ "},
                6: { value: 6, content : "综合☆☆☆☆☆☆"},
            }
        }
    },
    biology: {
        id: 3,
        getItemTypeDescs(edu = 0) {
            if (edu === 0) {
                return ItemTypeDesc.kAll.filter(desc => desc.type >= 3000 && desc.type < 4000);
            } else {
                return ItemTypeDesc.kAll.filter(desc => desc.type >= 3000 && desc.type < 4000 &&
                    (desc.edu === 0 || desc.edu === edu)
                );
            }
        },
        getKtTypeDescs() {
            return KtTypeDesc.kAll.filter(desc => desc.type >= 3000 && desc.type < 4000);
        },
         getKtTypeSearch() {
            return KtTypeDesc.kAll.filter(desc => desc.type >= 3000 && desc.type < 4000 && desc.type != 3888);
        },
        getAbilities() {
            return [
                { name: 'application', displayName: '应用能力' },
                { name: 'comprehension', displayName: '理解能力' },
                { name: 'experiment', displayName: '实验能力' },
                { name: 'knowledge', displayName: '知识能力' },
            ];
        },
        getPlanTypes() {
            return [
                { name: 1, displayName: '例题'},
                { name: 2, displayName: '练习题'},
                { name: 3, displayName: '测试题'}
            ]
        },
        getLessonSliceLevel() {
            return {
                1: { value: 1, content : "识记 ☆   "},
                2: { value: 2, content : "理解 ☆☆   "},
                3: { value: 3, content : "操作 ☆☆☆  "},
                4: { value: 4, content : "识别 ☆☆☆☆ "},
                5: { value: 5, content : "迁移 ☆☆☆☆☆ "},
                6: { value: 6, content : "综合☆☆☆☆☆☆"},
            }
        }
    },
    chemistry: {
        id: 4,
        getItemTypeDescs(edu = 0) {
            if (edu === 0) {
                return ItemTypeDesc.kAll.filter(desc => desc.type >= 4000 && desc.type < 5000);
            } else {
                return ItemTypeDesc.kAll.filter(desc => desc.type >= 4000 && desc.type < 5000 &&
                    (desc.edu === 0 || desc.edu === edu)
                );
            }
        },
        getKtTypeDescs() {
            return KtTypeDesc.kAll.filter(desc => desc.type >= 4000 && desc.type < 5000);
        },
         getKtTypeSearch() {
            return KtTypeDesc.kAll.filter(desc => desc.type >= 4000 && desc.type < 5000 && desc.type != 4888);
        },
        getAbilities() {
            return [
                { name: 'application', displayName: '应用能力' },
                { name: 'comprehension', displayName: '理解能力' },
                { name: 'analysis', displayName: '分析能力' },
                { name: 'experiment', displayName: '实验能力' },
                { name: 'knowledge', displayName: '知识能力' },
            ];
        },
        getPlanTypes() {
            return [
                { name: 1, displayName: '例题'},
                { name: 2, displayName: '练习题'},
                { name: 3, displayName: '测试题'}
            ]
        },
        getLessonSliceLevel() {
            return {
                1: { value: 1, content : "识记 ☆   "},
                2: { value: 2, content : "理解 ☆☆   "},
                3: { value: 3, content : "操作 ☆☆☆  "},
                4: { value: 4, content : "识别 ☆☆☆☆ "},
                5: { value: 5, content : "迁移 ☆☆☆☆☆ "},
                6: { value: 6, content : "综合☆☆☆☆☆☆"},
            }
        }
    },
    english: {
        id: 5,
        getItemTypeDescs(edu = 0) {
            return ItemTypeDesc.kAll.filter(desc => desc.type >= 5000 && desc.type < 6000 &&
                (desc.edu === 0 || desc.edu === edu)
            );
        },
        getKtTypeDescs() {
            return KtTypeDesc.kAll.filter(desc => desc.type >= 5000 && desc.type < 6000);
        },
         getKtTypeSearch() {
            return KtTypeDesc.kAll.filter(desc => desc.type >= 5000 && desc.type < 6000 && desc.type != 5888);
        },
        getAbilities() {
            return [];
        },
        getPlanTypes() {
            return [
                { name: 1, displayName: '例题'},
                { name: 2, displayName: '练习题'},
                { name: 3, displayName: '测试题'}
            ]
        },
        getLessonSliceLevel() {
            return {
                1: { value: 1, content : "识记 ☆   "},
                2: { value: 2, content : "理解 ☆☆   "},
                3: { value: 3, content : "操作 ☆☆☆  "},
                4: { value: 4, content : "识别 ☆☆☆☆ "},
                5: { value: 5, content : "迁移 ☆☆☆☆☆ "},
                6: { value: 6, content : "综合☆☆☆☆☆☆"},
            }
        }
    },

    chinese: {
        id: 6,
        getItemTypeDescs(edu = 0) {
            if (edu === 0) {
                return ItemTypeDesc.kAll.filter(desc => desc.type >= 6000 && desc.type < 7000);
            } else {
                return ItemTypeDesc.kAll.filter(desc => desc.type >= 6000 && desc.type < 7000 &&
                    (desc.edu === 0 || desc.edu === edu)
                );
            }
        },
        getKtTypeDescs() {
            return KtTypeDesc.kAll.filter(desc => desc.type >= 6000 && desc.type < 7000);
        },
        getKtTypeSearch() {
            return KtTypeDesc.kAll.filter(desc => desc.type >= 6000 && desc.type < 7000 && desc.type != 6888);
        },
        getAbilities() {
            return [];
        },
        getPlanTypes() {
            return [
                { name: 1, displayName: '例题'},
                { name: 2, displayName: '练习题'},
                { name: 3, displayName: '测试题'}
            ]
        },
        getLessonSliceLevel() {
            return {
                1: { value: 1, content : "识记 ☆   "},
                2: { value: 2, content : "理解 ☆☆   "},
                3: { value: 3, content : "操作 ☆☆☆  "},
                4: { value: 4, content : "识别 ☆☆☆☆ "},
                5: { value: 5, content : "迁移 ☆☆☆☆☆ "},
                6: { value: 6, content : "综合☆☆☆☆☆☆"},
            }
        }
    },

    history: {
        id: 7,
        getItemTypeDescs(edu = 0) {
            if (edu === 0) {
                return ItemTypeDesc.kAll.filter(desc => desc.type >= 7000 && desc.type < 8000);
            } else {
                return ItemTypeDesc.kAll.filter(desc => desc.type >= 7000 && desc.type < 8000 &&
                    (desc.edu === 0 || desc.edu === edu)
                );
            }
        },
        getKtTypeDescs() {
            return KtTypeDesc.kAll.filter(desc => desc.type >= 7000 && desc.type < 8000);
        },
        getKtTypeSearch() {
            return KtTypeDesc.kAll.filter(desc => desc.type >= 7000 && desc.type < 8000 && desc.type != 7888);
        },
        getAbilities() {
            return [];
        },
        getPlanTypes() {
            return [
                { name: 1, displayName: '例题'},
                { name: 2, displayName: '练习题'},
                { name: 3, displayName: '测试题'}
            ]
        },
        getLessonSliceLevel() {
            return {
                1: { value: 1, content : "识记 ☆   "},
                2: { value: 2, content : "理解 ☆☆   "},
                3: { value: 3, content : "操作 ☆☆☆  "},
                4: { value: 4, content : "识别 ☆☆☆☆ "},
                5: { value: 5, content : "迁移 ☆☆☆☆☆ "},
                6: { value: 6, content : "综合☆☆☆☆☆☆"},
            }
        }
    },

    polity: {
        id: 8,
        getItemTypeDescs(edu = 0) {
            if (edu === 0) {
                return ItemTypeDesc.kAll.filter(desc => desc.type >= 8000 && desc.type < 9000);
            } else {
                return ItemTypeDesc.kAll.filter(desc => desc.type >= 8000 && desc.type < 9000 &&
                    (desc.edu === 0 || desc.edu === edu)
                );
            }
        },
        getKtTypeDescs() {
            return KtTypeDesc.kAll.filter(desc => desc.type >= 8000 && desc.type < 9000);
        },
        getKtTypeSearch() {
            return KtTypeDesc.kAll.filter(desc => desc.type >= 8000 && desc.type < 9000 && desc.type != 8888);
        },
        getAbilities() {
            return [];
        },
        getPlanTypes() {
            return [
                { name: 1, displayName: '例题'},
                { name: 2, displayName: '练习题'},
                { name: 3, displayName: '测试题'}
            ]
        },
        getLessonSliceLevel() {
            return {
                1: { value: 1, content : "识记 ☆   "},
                2: { value: 2, content : "理解 ☆☆   "},
                3: { value: 3, content : "操作 ☆☆☆  "},
                4: { value: 4, content : "识别 ☆☆☆☆ "},
                5: { value: 5, content : "迁移 ☆☆☆☆☆ "},
                6: { value: 6, content : "综合☆☆☆☆☆☆"},
            }
        }
    },

    geography: {
        id: 9,
        getItemTypeDescs(edu = 0) {
            if (edu === 0) {
                return ItemTypeDesc.kAll.filter(desc => desc.type >= 9000 && desc.type < 10000);
            } else {
                return ItemTypeDesc.kAll.filter(desc => desc.type >= 9000 && desc.type < 10000 &&
                    (desc.edu === 0 || desc.edu === edu)
                );
            }
        },
        getKtTypeDescs() {
            return KtTypeDesc.kAll.filter(desc => desc.type >= 9000 && desc.type < 10000);
        },
        getKtTypeSearch() {
            return KtTypeDesc.kAll.filter(desc => desc.type >= 9000 && desc.type < 10000 && desc.type != 9888);
        },
        getAbilities() {
            return [];
        },
        getPlanTypes() {
            return [
                { name: 1, displayName: '例题'},
                { name: 2, displayName: '练习题'},
                { name: 3, displayName: '测试题'}
            ]
        },
        getLessonSliceLevel() {
            return {
                1: { value: 1, content : "识记 ☆   "},
                2: { value: 2, content : "理解 ☆☆   "},
                3: { value: 3, content : "操作 ☆☆☆  "},
                4: { value: 4, content : "识别 ☆☆☆☆ "},
                5: { value: 5, content : "迁移 ☆☆☆☆☆ "},
                6: { value: 6, content : "综合☆☆☆☆☆☆"},
            }
        }
    }
};


export class KtTypeDesc {
    constructor(type, name) {
        this.type = type;
        this.name = name;
    }

    static get(type) {
        let value = null;
        KtTypeDesc.kAll.forEach((desc) => {
            if (desc.type === type) {
                value = desc;
            }
        });
        return value;
    }
}


KtTypeDesc.kAll = [
    // 数学
    new KtTypeDesc(1102, '知识点'),
    new KtTypeDesc(1103, '方法'),
    new KtTypeDesc(1201, '题型'),
    new KtTypeDesc(1101, '载体'),
    new KtTypeDesc(1388, '初中'),
    new KtTypeDesc(1488, '高中'),

    // 物理
    new KtTypeDesc(2101, '知识点(初中)'),
    new KtTypeDesc(2102, '知识点(高中)'),
    new KtTypeDesc(2103, '方法'),
    // new KtTypeDesc(2104, '地区'),
    // new KtTypeDesc(2105, '题目类型'),
    new KtTypeDesc(2106, '模型'),
    new KtTypeDesc(2388, '初中'),
    new KtTypeDesc(2488, '高中'),

    // 生物
    new KtTypeDesc(3101, '形式(高中)'),
    new KtTypeDesc(3102, '知识点(高中)'),
    new KtTypeDesc(3103, '形式(初中)'),
    new KtTypeDesc(3104, '知识点(初中)'),
    new KtTypeDesc(3388, '初中'),
    new KtTypeDesc(3488, '高中'),

    // 化学
    new KtTypeDesc(4101, '考查形式(初中)'),
    new KtTypeDesc(4102, '知识点(初中)'),
    new KtTypeDesc(4103, '考查形式(高中)'),
    new KtTypeDesc(4104, '知识点(高中)'),
    new KtTypeDesc(4388, '初中'),
    new KtTypeDesc(4488, '高中'),

    // 英语
    new KtTypeDesc(5999, '语法'),
    new KtTypeDesc(5007, '话题'),
    new KtTypeDesc(5010, '阅读体裁'),
    new KtTypeDesc(5015, '作文体裁'),
    new KtTypeDesc(5388, '初中'),
    new KtTypeDesc(5488, '高中'),

    // 语文
    new KtTypeDesc(6999, '语法'),
    new KtTypeDesc(6007, '话题'),
    new KtTypeDesc(6010, '阅读体裁'),
    new KtTypeDesc(6015, '作文体裁'),
    new KtTypeDesc(6388, '初中'),
    new KtTypeDesc(6488, '高中'),

    // 历史
    new KtTypeDesc(7999, '语法'),
    new KtTypeDesc(7007, '话题'),
    new KtTypeDesc(7010, '阅读体裁'),
    new KtTypeDesc(7015, '作文体裁'),
    new KtTypeDesc(7388, '初中'),
    new KtTypeDesc(7488, '高中'),

        // 政治
    new KtTypeDesc(8999, '语法'),
    new KtTypeDesc(8007, '话题'),
    new KtTypeDesc(8010, '阅读体裁'),
    new KtTypeDesc(8015, '作文体裁'),
    new KtTypeDesc(8388, '初中'),
    new KtTypeDesc(8488, '高中'),
    new KtTypeDesc(8888, '教案切片'),

            //地理
    new KtTypeDesc(9999, '语法'),
    new KtTypeDesc(9007, '话题'),
    new KtTypeDesc(9010, '阅读体裁'),
    new KtTypeDesc(9015, '作文体裁'),
    new KtTypeDesc(9388, '初中'),
    new KtTypeDesc(9488, '高中'),
];


export class ItemTypeDesc {
    constructor(type, name, edu = 0) {
        this.type = type;
        this.name = name;
        this.edu = edu;
    }

    static get(type) {
        let value = null;
        ItemTypeDesc.kAll.forEach((desc) => {
            if (desc.type === type) {
                value = desc;
            }
        });
        if (value) {
            return value;
        }
        return new KtTypeDesc(type, '其他');
    }
}

ItemTypeDesc.kAll = [
    // 数学
    new ItemTypeDesc(1001, '单选题',3),
    new ItemTypeDesc(1001, '单选题',4),
    new ItemTypeDesc(1002, '填空题',3),
    new ItemTypeDesc(1002, '填空题',4),
    new ItemTypeDesc(1010, '解答题',3),
    new ItemTypeDesc(1003, '解答题',4),
    new ItemTypeDesc(1005, '判断题',3),
    new ItemTypeDesc(1005, '判断题',4),
    new ItemTypeDesc(1006, '作图题', 3),
    new ItemTypeDesc(1007, '选择题组', 3),
    new ItemTypeDesc(1007, '选择题组', 4),
    new ItemTypeDesc(1008, '填空题组', 3),
    new ItemTypeDesc(1008, '填空题组', 4),
    new ItemTypeDesc(1009, '混合题', 3),
    new ItemTypeDesc(1009, '混合题', 4),

    // 物理
    new ItemTypeDesc(2001, '单选题', 0),
    new ItemTypeDesc(2002, '填空题', 0),
    new ItemTypeDesc(2003, '解答题', 0),
    new ItemTypeDesc(2004, '实验题', 0),
    new ItemTypeDesc(2005, '多选题', 0),
    new ItemTypeDesc(2006, '计算题', 0),
    new ItemTypeDesc(2007, '作图题', 0),
    new ItemTypeDesc(2008, '科普阅读题', 0),
//    new ItemTypeDesc(2009, '选择题组', 0),
    new ItemTypeDesc(2012, '填空题组', 0),
    new ItemTypeDesc(2013, '判断题', 0),

    // 生物
    new ItemTypeDesc(3001, '单项选择', 0),
    // new ItemTypeDesc(3002, '填空题', 0),
    new ItemTypeDesc(3003, '判断题', 0),
    new ItemTypeDesc(3004, '计算题', 0),
    new ItemTypeDesc(3005, '非选择题', 0),

    // 化学
    new ItemTypeDesc(4001, '选择题', 0),
    // new ItemTypeDesc(4002, '填空题', 0),
    new ItemTypeDesc(4003, '判断题', 0),
    new ItemTypeDesc(4004, '计算题', 0),
    new ItemTypeDesc(4005, '非选择题', 0),


    // 英语
    new ItemTypeDesc(5001, '单项选择', 0),
    new ItemTypeDesc(5002, '选择题组', 0),
    new ItemTypeDesc(5003, '填空题', 0),
    new ItemTypeDesc(5004, '填空题组', 0),
    new ItemTypeDesc(5005, '完形填空', 0),
    new ItemTypeDesc(5006, '听力选择', 0),
    new ItemTypeDesc(5007, '听力填空', 0),
    new ItemTypeDesc(5008, '阅读理解', 0),
    new ItemTypeDesc(5009, '阅读与表达', 0),
    new ItemTypeDesc(5010, '视频', 0),
    new ItemTypeDesc(5011, '七选五等', 0),
    new ItemTypeDesc(5012, '作文', 0),
    new ItemTypeDesc(5013, '判断题', 0),

        // 语文
    new ItemTypeDesc(6006, '现代文阅读', 4),
    new ItemTypeDesc(6007, '文言文阅读', 4),
    new ItemTypeDesc(6008, '古代诗歌阅读', 4),
    new ItemTypeDesc(6009, '名句名篇默写', 4),
    new ItemTypeDesc(6010, '语言文字运用', 4),
    new ItemTypeDesc(6011, '作文', 0),
    new ItemTypeDesc(6012, '微写作', 4),
    new ItemTypeDesc(6014, '材料概括分析题', 4),
    new ItemTypeDesc(6016, '名著阅读题', 4),
    new ItemTypeDesc(6001, '选择题', 4),
    new ItemTypeDesc(6002, '填空题', 0),
    new ItemTypeDesc(6003, '填空题组', 0),
    new ItemTypeDesc(6013, '判断题', 0),
    // new ItemTypeDesc(6013, '判断题组', 0),
    new ItemTypeDesc(6004, '简答题', 4),
    new ItemTypeDesc(6005, '简答题组', 4),
    // new ItemTypeDesc(6015, '句子成分划分', 4),
    new ItemTypeDesc(6017, '单选题', 3),
    new ItemTypeDesc(6018, '多选题', 3),
    new ItemTypeDesc(6019, '选择题组', 3),
    // new ItemTypeDesc(6020, '听力', 3),
    // new ItemTypeDesc(6021, '听力填空', 3),
    new ItemTypeDesc(6022, '解答题组', 3),
    new ItemTypeDesc(6023, '解答题', 3),
    new ItemTypeDesc(6024, '材料信息题', 3),
    new ItemTypeDesc(6025, '语料题', 3),

        // 历史
    new ItemTypeDesc(7001, '单选题', 0),
    new ItemTypeDesc(7002, '双选题', 0),
    new ItemTypeDesc(7003, '填空题', 0),
    new ItemTypeDesc(7004, '主观题', 0),
    new ItemTypeDesc(7005, '判断题', 0),
    //new ItemTypeDesc(7006, '连线题', 0),
    new ItemTypeDesc(7007, '选择题组', 0),
    new ItemTypeDesc(7008, '双项选择题组', 0),
    new ItemTypeDesc(7009, '填空题组', 0),

        // 政治
    new ItemTypeDesc(8001, '单选题', 0),
    new ItemTypeDesc(8002, '双选题', 0),
    new ItemTypeDesc(8003, '填空题', 0),
    new ItemTypeDesc(8004, '主观题', 0),
    new ItemTypeDesc(8005, '判断题', 0),
    //new ItemTypeDesc(8006, '连线题', 0),
    new ItemTypeDesc(8007, '选择题组', 0),
    new ItemTypeDesc(8008, '双项选择题组', 0),
    new ItemTypeDesc(8009, '填空题组', 0),

        // 地理
    new ItemTypeDesc(9001, '单选题', 0),
    new ItemTypeDesc(9002, '双选题', 0),
    new ItemTypeDesc(9003, '填空题', 0),
    new ItemTypeDesc(9004, '主观题', 0),
    new ItemTypeDesc(9005, '判断题', 0),
    //new ItemTypeDesc(9006, '连线题', 0),
    new ItemTypeDesc(9007, '选择题组', 0),
    new ItemTypeDesc(9008, '双项选择题组', 0),
    new ItemTypeDesc(9009, '填空题组', 0),
];

export class ItemClassDesc {
    constructor(class_, name, edu) {
        this.class_ = class_;
        this.name = name;
        this.edu = edu;
    }

    static defaultForEdu(edu) {
        return ItemClassDesc.allForEdu(edu)[0];
    }

    static allForEdu(edu) {
        return ItemClassDesc.kAll.filter(ed => ed.edu === edu);
    }
    
    static allForEduTestType(edu,type) {
        return ItemTypeDesc.kAll.filter(ed => (ed.edu === edu || ed.edu== 0 )&& ed.type<parseInt (type/1000)*1000+1000 && ed.type>parseInt (type/1000)*1000);
    }

    static get(class_) {
        let value = null;
        ItemClassDesc.kAll.forEach((classDesc) => {
            if (classDesc.class_ === class_) {
                value = classDesc;
            }
        });
        return value;
    }
}

export class ItemClass {}

ItemClass.kGaokaoZhenti = 1;
ItemClass.kZhongkaoZhenti = 2;
ItemClass.kGaokaoMoni = 3;
ItemClass.ZhongkaoMoni = 4;
ItemClass.GaozhongQimo = 5;
ItemClass.ChuzhongQimo = 6;
ItemClass.GaozhongXiti = 7;
ItemClass.ChuzhongXiti = 8;
ItemClass.kXiaoao = 9;
ItemClass.kXiaoaoXiti = 10;

ItemClassDesc.kAll = [
    new ItemClassDesc(11, '优能教案', 3),
    new ItemClassDesc(11, '优能教案', 4),
    new ItemClassDesc(1, '高考真题', 4),
    new ItemClassDesc(2, '中考真题', 3),
    new ItemClassDesc(3, '高中模拟', 4),
    new ItemClassDesc(4, '初中模拟', 3),
    new ItemClassDesc(5, '高中期末', 4),
    new ItemClassDesc(6, '初中期末', 3),
    new ItemClassDesc(7, '高中习题', 4),
    new ItemClassDesc(8, '初中习题', 3),
    new ItemClassDesc(9, '小学奥数', 2),
    new ItemClassDesc(10, '小奥改编', 2),
];
