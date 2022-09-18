import { SquareButton, Card } from '@pooltogether/react-components'
import { useTranslation } from 'next-i18next'
import React from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Action } from '../../components/ProposalCreation/Action'
import { EMPTY_ACTION } from '../../components/ProposalCreation/ProposalCreationForm'
import { useGovernorAlpha } from '../../hooks/useGovernorAlpha'

export const ActionsCard = (props) => {
  const { t } = useTranslation()
  const { data: governorAlpha, isFetched: governorAlphaIsFetched } = useGovernorAlpha()

  const name = 'actions'

  const { control } = useFormContext()
  const {
    fields: actions,
    append,
    remove
  } = useFieldArray({
    control,
    name
  })

  if (!governorAlphaIsFetched) return null

  const { proposalMaxOperations } = governorAlpha

  return (
    <Card className='mb-6'>
      <h4 className='mb-6'>{t('actions')}</h4>
      <p className='mb-4'>{t('actionCardDescription')}</p>
      {actions.map((action, index) => {
        return (
          <Action
            key={action.id}
            actionPath={`actions[${index}]`}
            index={index}
            deleteAction={() => remove(index)}
            hideRemoveButton={actions.length === 1 && index === 0}
          />
        )
      })}
      <SquareButton
        className='mt-8'
        type='button'
        disabled={actions.length >= proposalMaxOperations}
        onClick={(e) => {
          e.preventDefault()
          append(EMPTY_ACTION)
        }}
      >
        {t('addAnotherAction')}
      </SquareButton>
    </Card>
  )
}
