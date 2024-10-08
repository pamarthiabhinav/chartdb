import { Button } from '@/components/button/button';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/select/select';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/tooltip/tooltip';
import { useChartDB } from '@/hooks/use-chartdb';
import { DBRelationship, RelationshipType } from '@/lib/domain/db-relationship';
import { useReactFlow } from '@xyflow/react';
import { FileMinus2, FileOutput, Trash2 } from 'lucide-react';
import React, { useCallback } from 'react';

export interface RelationshipListItemContentProps {
    relationship: DBRelationship;
}

export const RelationshipListItemContent: React.FC<
    RelationshipListItemContentProps
> = ({ relationship }) => {
    const { getTable, getField, updateRelationship, removeRelationship } =
        useChartDB();
    const { deleteElements } = useReactFlow();

    const targetTable = getTable(relationship.targetTableId);
    const targetField = getField(
        relationship.targetTableId,
        relationship.targetFieldId
    );

    const sourceTable = getTable(relationship.sourceTableId);
    const sourceField = getField(
        relationship.sourceTableId,
        relationship.sourceFieldId
    );

    const deleteRelationshipHandler = useCallback(() => {
        removeRelationship(relationship.id);
        deleteElements({
            edges: [{ id: relationship.id }],
        });
    }, [relationship.id, removeRelationship, deleteElements]);

    return (
        <div className="rounded-b-md px-1 flex flex-col my-1">
            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center gap-1 text-xs">
                    <div className="flex flex-col gap-2 text-xs overflow-hidden">
                        <div className="flex flex-row items-center gap-1">
                            <FileMinus2 className="h-4 w-4 text-slate-700" />
                            <div className="font-bold text-slate-700">
                                Primary
                            </div>
                        </div>
                        <Tooltip>
                            <TooltipTrigger>
                                <div className="text-sm  overflow-hidden whitespace-nowrap text-ellipsis ">
                                    {targetTable?.name}({targetField?.name})
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                {targetTable?.name}({targetField?.name})
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    <div className="flex flex-col gap-2 text-xs overflow-hidden">
                        <div className="flex flex-row items-center gap-1">
                            <FileOutput className="h-4 w-4 text-slate-700" />
                            <div className="font-bold text-slate-700">
                                Foreign
                            </div>
                        </div>
                        <Tooltip>
                            <TooltipTrigger>
                                <div className="text-sm  overflow-hidden whitespace-nowrap text-ellipsis ">
                                    {sourceTable?.name}({sourceField?.name})
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                {sourceTable?.name}({sourceField?.name})
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>
                <div className="flex flex-col gap-2 text-xs">
                    <div className="flex flex-row items-center gap-1">
                        <FileOutput className="h-4 w-4 text-slate-700" />
                        <div className="font-bold text-slate-700">
                            Cardinality
                        </div>
                    </div>

                    <Select
                        value={relationship.type}
                        onValueChange={(value: RelationshipType) =>
                            updateRelationship(relationship.id, { type: value })
                        }
                    >
                        <SelectTrigger className="h-8">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="one_to_one">
                                    One to One
                                </SelectItem>
                                <SelectItem value="one_to_many">
                                    One to Many
                                </SelectItem>
                                <SelectItem value="many_to_one">
                                    Many to One
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="flex items-center justify-center flex-1 pt-2">
                <Button
                    variant="ghost"
                    className="text-xs h-8 p-2"
                    onClick={deleteRelationshipHandler}
                >
                    <Trash2 className="h-3.5 w-3.5 mr-1 text-red-700" />
                    <div className="text-red-700">Delete</div>
                </Button>
            </div>
        </div>
    );
};
