export const locationIds = ['garden','monument','museum','forged-park','steppe'] as const;
export type LocationId = typeof locationIds[number];
export type SecondaryQuestId = 'garden-lab'|'monument-details'|'museum-pairs'|'forged-memory'|'steppe-fragments';
export type QuestId = 'garden-search'|'monument-quiz'|'museum-quiz'|'forged-puzzle'|'steppe-quiz'|SecondaryQuestId;
export type ActivityProgress = {kind:'activity';solvedTaskIds:string[]};
export type QuestProgress = {kind:'search';foundTargetIds:string[];mistakes?:number;hintsUsed?:number}|{kind:'quiz';solvedQuestionIds:string[];currentQuestionIndex:number}|{kind:'puzzle';tileOrder:number[]}|ActivityProgress;
export interface Progress {schemaVersion:1;contentVersion:2;legacyStampLocationIds:LocationId[];startedAt:string;updatedAt:string;completedAt:string|null;lastLocationId:LocationId|null;visitedLocationIds:LocationId[];completedQuestIds:QuestId[];stampLocationIds:LocationId[];questProgress:Partial<Record<QuestId,QuestProgress>>}
export interface InfoBlock {title:string;text:string;photoId:number;sourceId:string;sections?:{title:string;text:string}[];facts?:{value:string;label:string}[]}
export interface Location {id:LocationId;title:string;shortTitle:string;theme:string;durationMinutes:number;heroPhotoId:number;galleryPhotoIds:number[];description:string;questId:QuestId;questTitle:string;stampLabel:string;infoBlocks:InfoBlock[]}
export interface QuizQuestion {id:string;prompt:string;photoId?:number;options:{id:string;text:string}[];correctOptionId:string;explanation:string;sourceId:string;hint?:string}
export interface PhotoCredit {id:number;title:string;page:string;author:string;license:string;licenseUrl:string;filename:string;description:string;modifications:string}
