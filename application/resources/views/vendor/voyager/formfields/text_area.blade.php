@php $details_json = $row->details  ? json_decode($row->details) : false; @endphp
<textarea class="form-control resizable-editor" name="{{ $row->field }}" @if(isset($details_json->json)) data-editor="json" id="json-input-{{ $row->field }}" @endif
>@if(isset($dataTypeContent->{$row->field})){{ old($row->field, $dataTypeContent->{$row->field}) }}@elseif(isset($options->default)){{ old($row->field, $options->default) }}@else{{ old($row->field) }}@endif</textarea>
