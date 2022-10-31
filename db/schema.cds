namespace my.LandR;
using { cuid, sap.common.CodeList, managed } from '@sap/cds/common';

entity CourseCategory : cuid, CodeList {
}

entity Course : cuid, managed {
    CourseName : String(100);
    Description : String(480);
    ImageURL : String(2048);
    CourseCategory : Association to one CourseCategory;
    Review : Composition of many Reviews;
    CourseMaterial : Composition of many CourseMaterials;
}

aspect Reviews : cuid, managed {
    Rating : String(5);
    Comment : String(960);
}

entity LearningObject : cuid, managed{
    Name : String(200);
    Content : String(3040);
    Description : String(480);
    Type : Association to one LearningObjectType;
}

entity LearningObjectType : cuid, CodeList{
}

aspect CourseMaterials : cuid, managed {
    LearningObject : Association to one LearningObject;
}