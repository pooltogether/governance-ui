import React from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'

import { useTranslation } from 'react-i18next'
import { Button, Card } from '@pooltogether/react-components'
import { useGovernorAlpha } from '../hooks/useGovernorAlpha'
import { usePrizePools } from '../hooks/usePrizePools'
import { EMPTY_ACTION } from '../components/ProposalCreation/ProposalCreationForm'
import { Action } from '../components/ProposalCreation/Action'

export const ActionsCard = (props) => {
  const { t } = useTranslation()
  const { isFetched: prizePoolsIsFetched } = usePrizePools()
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

  if (!prizePoolsIsFetched || !governorAlphaIsFetched) return null

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
      <Button
        className='mt-8'
        type='button'
        disabled={actions.length >= proposalMaxOperations}
        onClick={(e) => {
          e.preventDefault()
          append(EMPTY_ACTION)
        }}
      >
        {t('addAnotherAction')}
      </Button>
    </Card>
  )
}
