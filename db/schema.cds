namespace my.LandR;
using { cuid, sap.common.CodeList, managed } from '@sap/cds/common';

entity CourseCategory : cuid, managed, CodeList {
}

entity Course : cuid, managed {
    CourseName : String(100);
    ShortDescription : String(420);
    Description : String(1240);
    ImageURL : String(2048);
    CourseCategory : Association to one CourseCategory;
    Review : Composition of many Reviews;
    CourseMaterial : Composition of many CourseMaterials;
}

aspect Reviews : cuid, managed {
    Comment : String(960);
    ReviewIndicator : Integer;
}

entity LearningObject : cuid, managed{
    Name : String(200);
    Content : String(3040);
    Description : String(1240);
    Guide : String(1240);
    Type : Association to one LearningObjectType;
    CompletionList : Composition of many CompletionEntry;
}

entity LearningObjectType : cuid, CodeList{
}

aspect CourseMaterials : cuid, managed {
    LearningObject : Association to one LearningObject;
}

aspect CompletionEntry : cuid, managed {
}