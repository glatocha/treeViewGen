const tree_item = {
    title: "Item title",
    description: "item description",
    notes: 'Some defaults notes',
    isParent: false,
    extraClass: '',
    tags: '',
    isOB: false,
    isFB: false,
    isFC: false,
    children: []
}

// const def_tree = {
//     title: "Master title",
//     description: "Default tree",
//     notes: 'Some defaults notes',
//     isParent: false,
//     extraClass: '',
//     tags: '',
//     isOB: true,
//     isFB: false,
//     isFC: false,
//     children: [
//         {
//             title: "Item title 1",
//             description: "item description",
//             notes: 'Some defaults notes',
//             isParent: false,
//             extraClass: '',
//             tags: '',
//             isOB: false,
//             isFB: false,
//             isFC: true,
//             children: [],
//         }]
// }


const def_tree = {
    title: "Master title",
    description: "Default tree",
    notes: 'Some defaults notes',
    isParent: true,
    extraClass: '',
    tags: '',
    isOB: true,
    isFB: false,
    isFC: false,
    children: [
        {
            title: "Item title 1",
            description: "item description",
            notes: 'Some defaults notes',
            isParent: true,
            extraClass: '',
            tags: '',
            isOB: false,
            isFB: false,
            isFC: true,
            children: [
                {
                    title: "Item title 1_1",
                    description: "item description",
                    notes: 'Some defaults notes',
                    isParent: false,
                    extraClass: '',
                    tags: '',
                    isOB: false,
                    isFB: true,
                    isFC: false,
                    children: []
                }
            ]
        },
        {
            title: "Item title 2",
            description: "item description",
            notes: 'Some defaults notes',
            isParent: false,
            extraClass: '',
            tags: '',
            isOB: false,
            isFB: false,
            isFC: true,
            children: []
        },
        {
            title: "Item title 3",
            description: "item description",
            notes: 'Some defaults notes',
            isParent: false,
            extraClass: '',
            tags: '',
            isOB: false,
            isFB: false,
            isFC: false,
            children: []
        }
    ]
}